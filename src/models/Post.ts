import { Schema, Model, model, Types } from 'mongoose';
import './Comment';
import './User';

interface Meta {
  views: number;
}

interface Post {
  user_id: Types.ObjectId;
  title: string;
  body: string;
  submitted_at?: Date;
  published_at?: Date;
  meta: Meta;
  created_at: Date;
  updated_at: Date;
  comments: Types.ArraySubdocument;
}

interface PostMethods {
  status(): string;
}

type PostModel = Model<Post, object, PostMethods>;

const schema = new Schema<Post, PostModel, PostMethods>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    submitted_at: Date,
    published_at: Date,
    meta: {
      views: { type: Number, required: false, default: 0 },
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
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

schema.method('status', function status() {
  if (!this.submitted_at) {
    return 'draft';
  }

  if (this.submitted_at && !this.published_at) {
    return 'submitted';
  }

  return 'published';
});

export default model('Post', schema);
