import { Schema, Model, model, Types } from 'mongoose';
import './Post';
import './User';

export interface Comment {
  user_id: Types.ObjectId;
  post_id: Types.ObjectId;
  body: string;
  created_at: Date;
  updated_at: Date;
  user: Types.Subdocument;
  post: Types.Subdocument;
}

const schema = new Schema<Comment, Model<Comment>>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    body: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

schema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

schema.virtual('post', {
  ref: 'Post',
  localField: 'post_id',
  foreignField: '_id',
  justOne: true,
});

export default model('Comment', schema);
