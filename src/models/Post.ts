import { Schema, Model, model, Types } from 'mongoose';
import './Comment';
import './User';

interface Meta {
  views: number;
}

export interface Post {
  _id: Types.ObjectId;
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
  published(): boolean;
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

schema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post_id',
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

schema.method('published', function status() {
  return this.status() === 'published';
});

export default model<Post, PostModel>('Post', schema);
