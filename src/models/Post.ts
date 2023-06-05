import { Schema, Model, model, Types } from 'mongoose';

interface Meta {
  views: number;
}

interface Post {
  userId: Types.ObjectId;
  title: string;
  body: string;
  submitted_at?: Date;
  published_at?: Date;
  meta: Meta;
  created_at: Date;
  updated_at: Date;
}

interface PostMethods {
  status(): string;
}

type PostModel = Model<Post, object, PostMethods>;

const schema = new Schema<Post, PostModel, PostMethods>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
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
