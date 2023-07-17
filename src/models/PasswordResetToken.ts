import {
  Schema,
  Model,
  model,
  HydratedDocument,
  QueryWithHelpers,
} from 'mongoose';
import bcrypt from 'bcrypt';
import './Post';
import { add, isAfter, isBefore } from 'date-fns';
import appConfig from '../config/app';

const config = appConfig();

interface PasswordResetToken {
  email: string;
  token: string;
  created_at: Date;
  updated_at: Date;
}

interface PasswordResetTokenMethods {
  recentlyCreated(): boolean;
  hasExpired(): boolean;
  isValid(token: string): Promise<boolean>;
}

interface PasswordResetTokenQueryHelpers {
  byEmail(
    email: string,
  ): QueryWithHelpers<
    HydratedDocument<PasswordResetToken>[],
    HydratedDocument<PasswordResetToken>,
    PasswordResetTokenQueryHelpers
  >;
}

type PasswordResetTokenModel = Model<
  PasswordResetToken,
  PasswordResetTokenQueryHelpers,
  PasswordResetTokenMethods
>;

const schema = new Schema<
  PasswordResetToken,
  PasswordResetTokenModel,
  PasswordResetTokenMethods,
  PasswordResetTokenQueryHelpers
>(
  {
    email: { type: String, required: true, index: true },
    token: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'password_reset_tokens',
  },
);

schema.pre('save', async function (next) {
  if (!this.isModified('token')) return next();

  try {
    this.token = await bcrypt.hash(this.token, 10);

    next();
  } catch (error) {
    next(error);
  }
});

schema.query.byEmail = function (email: string) {
  return this.where({ email });
};

schema.methods.recentlyCreated = function () {
  const throttle: number = config.password.throttle;

  if (throttle <= 0) {
    return false;
  }

  return isAfter(
    add(this.created_at, {
      seconds: throttle,
    }),
    new Date(),
  );
};

schema.methods.hasExpired = function () {
  return isBefore(
    add(this.created_at, {
      minutes: config.password.expiresIn,
    }),
    new Date(),
  );
};

schema.methods.isValid = async function (token: string): Promise<boolean> {
  return bcrypt.compare(token, this.token);
};

export default model<PasswordResetToken, PasswordResetTokenModel>(
  'PasswordResetToken',
  schema,
);
