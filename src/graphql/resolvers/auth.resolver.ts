import { GraphQLError } from 'graphql';
import User from '../../models/User';
import { generateToken } from '../../config/auth';

export default {
  Query: {
    getAuthenticatedUser(_, __, context) {
      return context.user;
    },
  },
  Mutation: {
    async register(_, { input: { name, email, password } }) {
      // TODO: validate

      const user = await User.findOne({ email });

      if (user) {
        throw new GraphQLError('Email is already taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'email',
          },
        });
      }

      const newUser = new User({ name, email, password });

      const res = await newUser.save();

      const token = generateToken(res);

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
      const user = await User.findOne({ email });

      if (
        !user ||
        !(await user.validatePassword(password)) ||
        user.suspended()
      ) {
        throw new GraphQLError('Invalid email or password submitted', {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'email',
          },
        });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        meta: {
          token,
        },
      };
    },
    forgotPassword() {
      // TODO:
    },
    resetPassword() {
      // TODO:
    },
  },
};
