import { Schema, Model, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import './Post';

export interface User {
  _id: Types.ObjectId;
  _doc: User;
  name: string;
  email: string;
  password: string;
  is_admin: boolean;
  suspended_at: Date;
  created_at: Date;
  updated_at: Date;
  posts: Types.ArraySubdocument;
}

interface UserMethods {
  validatePassword(password: string): Promise<boolean>;
  suspended(): boolean;
}

type UserModel = Model<User, object, UserMethods>;

const schema = new Schema<User, UserModel, UserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    is_admin: { type: Boolean, required: false, default: false },
    suspended_at: { type: Schema.Types.Date, required: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);

    next();
  } catch (error) {
    next(error);
  }
});

schema.methods.validatePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

schema.methods.suspended = function () {
  return !!this.suspended_at;
};

schema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user_id',
});

export default model<User, UserModel>('User', schema);
