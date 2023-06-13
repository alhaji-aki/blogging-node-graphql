import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

async function getUser(email: string) {
  return User.findOne({ email });
}

function generateAuthToken(user) {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.APP_KEY,
    { expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN || '1h' },
  );
}

export default {
  Query: {
    getAuthenticatedUser(_, __, { authenticatedUser }) {
      return authenticatedUser;
    },
  },
  Mutation: {
    async register(_, { input: { name, email, password } }) {
      // TODO: validate

      const user = await getUser(email);

      if (user) {
        throw new GraphQLError('Email is already taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'email',
            http: { status: 422 },
          },
        });
      }

      const newUser = new User({ name, email, password });

      const res = await newUser.save();

      const token = generateAuthToken(res);

      return {
        ...res._doc,
        id: res._id,
        meta: {
          token,
        },
      };
    },
    async login(_, { email, password }) {
      // TODO: validate credentials

      // get user
      const user = await getUser(email);

      if (
        !user ||
        !(await user.validatePassword(password)) ||
        user.suspended()
      ) {
        throw new GraphQLError('Invalid email or password submitted', {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'email',
            http: { status: 422 },
          },
        });
      }

      const token = generateAuthToken(user);

      return {
        ...user._doc,
        id: user._id,
        meta: {
          token,
        },
      };
    },
  },
};
