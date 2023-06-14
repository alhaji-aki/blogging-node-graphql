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
  body?: string;
  submitted_at?: Date;
  published_at?: Date;
  meta: Meta;
  created_at: Date;
  updated_at: Date;
  user: Types.Subdocument;
  comments: Types.ArraySubdocument;
}

interface PostMethods {
  status(): string;
  completed(): boolean;
  submitted(): boolean;
  published(): boolean;
}

type PostModel = Model<Post, object, PostMethods>;

const schema = new Schema<Post, PostModel, PostMethods>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: String,
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
  if (!this.submitted() && !this.published()) {
    return 'draft';
  }

  if (this.submitted() && !this.published()) {
    return 'submitted';
  }

  return 'published';
});

schema.method('completed', function status() {
  return this.title && this.body;
});

schema.method('submitted', function status() {
  return !!this.submitted_at;
});

schema.method('published', function status() {
  return !!this.published_at;
});

export default model<Post, PostModel>('Post', schema);
