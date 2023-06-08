import { Schema, Model, model, Types } from 'mongoose';

interface Comment {
  user_id: Types.ObjectId;
  post_id: Types.ObjectId;
  body: string;
  created_at: Date;
  updated_at: Date;
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

export default model('Comment', schema);
