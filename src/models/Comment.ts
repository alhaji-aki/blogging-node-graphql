import { Schema, Model, model, Types } from 'mongoose';

interface Comment {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  body: string;
  created_at: Date;
  updated_at: Date;
}

const schema = new Schema<Comment, Model<Comment>>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    body: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default model('Comment', schema);
