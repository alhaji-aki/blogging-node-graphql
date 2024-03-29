import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import Validator from 'validatorjs';
import User from '../../models/User';
import appConfig from '../../config/app';

const config = appConfig();

async function getUser(email: string) {
  return User.findOne({ email });
}

function generateAuthToken(user) {
  return jwt.sign(
    {
      id: user.id,
    },
    config.key,
    { expiresIn: config.auth.expiresIn },
  );
}

export default {
  Query: {
    getAuthenticatedUser(_, __, { authenticatedUser }) {
      return authenticatedUser;
    },
  },
  Mutation: {
    async register(_, { input }) {
      const validation = new Validator(input, {
        name: ['required', 'string', 'max:255'],
        email: ['required', 'string', 'email', 'max:255'],
        password: ['required', 'string', 'confirmed', 'max:255'],
      });

      if (validation.fails()) {
        throw new GraphQLError(
          'Invalid data submitted. See extentions.errors for more details',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              http: { status: 422 },
              errors: validation.errors.all(),
            },
          },
        );
      }

      const user = await getUser(input.email);

      if (user) {
        throw new GraphQLError('Email is already taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 422 },
            errors: {
              email: ['Email is already taken'],
            },
          },
        });
      }

      const newUser = new User(input);

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
    async login(_, args) {
      const validation = new Validator(args, {
        email: ['required', 'string', 'email'],
        password: ['required', 'string'],
      });

      if (validation.fails()) {
        throw new GraphQLError(
          'Invalid data submitted. See extentions.errors for more details',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              http: { status: 422 },
              errors: validation.errors.all(),
            },
          },
        );
      }

      // get user
      const user = await getUser(args.email);

      if (
        !user ||
        !(await user.validatePassword(args.password)) ||
        user.suspended()
      ) {
        throw new GraphQLError('Invalid email or password submitted', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 422 },
            errors: {
              email: ['Invalid email or password submitted'],
            },
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
