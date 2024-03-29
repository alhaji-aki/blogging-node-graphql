import { GraphQLError } from 'graphql';
import crypto from 'crypto';
import User from '../../models/User';
import PasswordResetToken from '../../models/PasswordResetToken';
import EmailQueue from '../../queues/EmailQueue';
import appConfig from '../../config/app';

const config = appConfig();

async function getUser(email: string) {
  return User.findOne({ email });
}

function validateUser(user) {
  if (!user || user.suspended()) {
    throw new GraphQLError(
      'We could not find any users with this email address',
      {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'email',
          http: { status: 422 },
        },
      },
    );
  }
}

async function findTokenForEmail(email: string) {
  return PasswordResetToken.findOne({
    email,
  }).exec();
}

function checkIfTokenWasRecentlyCreated(tokenModel) {
  if (tokenModel && tokenModel.recentlyCreated()) {
    throw new GraphQLError('Please wait a while before retrying...', {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName: 'email',
        http: { status: 429 },
      },
    });
  }
}

async function deleteExistingTokensForEmail(email: string) {
  PasswordResetToken.deleteMany().byEmail(email).exec();
}

function generateResetToken(): string {
  const hmac = crypto.createHmac('sha256', config.key);
  return hmac.update(crypto.randomBytes(40).toString('hex')).digest('hex');
}

async function validateTokenModel(tokenModel, token: string) {
  if (
    !tokenModel ||
    tokenModel.hasExpired() ||
    !(await tokenModel.isValid(token))
  ) {
    throw new GraphQLError('Invalid token.', {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName: 'email',
        http: { status: 422 },
      },
    });
  }
}

export default {
  Mutation: {
    async forgotPassword(_, { email }) {
      const user = await getUser(email);

      validateUser(user);

      checkIfTokenWasRecentlyCreated(await findTokenForEmail(email));

      await deleteExistingTokensForEmail(email);

      const token = generateResetToken();

      const tokenModel = new PasswordResetToken({ email, token });

      await tokenModel.save();

      await EmailQueue.add('password-reset-job', { email, token });

      return 'Password reset link sent to your email.';
    },
    async resetPassword(_, { input: { token, email, password } }) {
      const user = await getUser(email);

      validateUser(user);

      await validateTokenModel(await findTokenForEmail(email), token);

      user.password = password;
      await user.save();

      await deleteExistingTokensForEmail(email);

      return 'Password reset successful. You can now login.';
    },
  },
};
