import User from '../../models/User';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.APP_KEY,
    { expiresIn: process.env.AUTH_EXPIRES_IN },
  );
}

export default {
  Query: {
    getAuthenticatedUser() {
      // TODO:
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
    login() {
      // TODO:
    },
    forgotPassword() {
      // TODO:
    },
    resetPassword() {
      // TODO:
    },
  },
};
