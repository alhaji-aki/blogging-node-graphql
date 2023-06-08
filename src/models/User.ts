import { Schema, Model, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

interface User {
  name: string;
  email: string;
  password: string;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
  posts: Types.ArraySubdocument;
  validatePassword(password: string): boolean;
}

const schema = new Schema<User, Model<User>>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    is_admin: { type: Boolean, required: false, default: false },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
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

export default model('User', schema);
