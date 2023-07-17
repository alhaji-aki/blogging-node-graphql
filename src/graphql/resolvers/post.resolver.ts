import { GraphQLError } from 'graphql';
import Validator from 'validatorjs';
import Post, { Post as PostInterface } from '../../models/Post';
import PostPolicy from '../../policies/post.policy';
import User from '../../models/User';

function getQueryFilter(filter) {
  const query: { title?: any; submitted_at?: any; published_at?: any } = {};

  if (filter && filter.query) {
    query.title = { $regex: filter.query, $options: 'i' };
  }

  if (filter && filter.status) {
    switch (filter.status) {
      case 'draft':
        query.submitted_at = { $eq: null };
        query.published_at = { $eq: null };
        break;
      case 'submitted':
        query.submitted_at = { $eq: null };
        query.published_at = { $not: { $eq: null } };
        break;
      case 'published':
        query.published_at = { $not: { $eq: null } };
        query.submitted_at = { $not: { $eq: null } };
        break;
    }
  }

  return query;
}

function getQuerySorters(filter) {
  const sort = {};

  if (filter && filter.sort_by) {
    switch (filter.sort_by) {
      case 'popular':
        sort['meta.views'] = filter.sort_direction || 'desc';
        break;
      case 'published_at':
        sort['published_at'] = filter.sort_direction || 'desc';
        break;
      case 'created_at':
        sort['created_at'] = filter.sort_direction || 'desc';
        break;
    }
  }

  return sort;
}

export default {
  Query: {
    async getPosts(_, { filter }): Promise<Array<PostInterface>> {
      const suspendedUsers = (
        await User.find({}).where('suspended_at').ne(null).select('_id').exec()
      ).map((doc) => doc._id);

      return await Post.find({
        user_id: { $not: { $in: suspendedUsers } },
        published_at: { $not: { $eq: null } },
        ...getQueryFilter(filter),
      })
        .sort(getQuerySorters(filter))
        .populate('user')
        .exec();
    },
    async getPublishedPost(
      _,
      { id },
      { authenticatedUser },
    ): Promise<PostInterface> {
      const post = await Post.findById(id)
        .populate('user')
        .populate({ path: 'comments', populate: { path: 'user' } })
        .exec();

      PostPolicy.viewPublished(authenticatedUser, post);

      // increment view count
      await post.updateOne({ $inc: { 'meta.views': 1 } }).exec();

      return post;
    },
    async getPost(_, { id }, { authenticatedUser }): Promise<PostInterface> {
      const post = await Post.findById(id)
        .populate('user')
        .populate({ path: 'comments', populate: { path: 'user' } })
        .exec();

      PostPolicy.view(authenticatedUser, post);

      return post;
    },
  },
  Mutation: {
    async createPost(
      _,
      { input },
      { authenticatedUser },
    ): Promise<PostInterface> {
      const validation = new Validator(input, {
        title: ['nullable', 'string', 'max:255'],
        body: ['nullable', 'string'],
        submit: ['nullable', 'boolean'],
      });

      if (validation.fails()) {
        throw new GraphQLError(
          'Invalid data submitted. See extentions.errors for more details',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              http: { status: 422 },
              errors: validation.errors.all(),
            },
          },
        );
      }

      if (!input.title && !input.body) {
        throw new GraphQLError(
          'You cannot submit an incomplete post. Post must have either a title or a body',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              http: { status: 422 },
              errors: {
                title: [
                  'You cannot submit an incomplete post. Post must have either a title or a body',
                ],
              },
            },
          },
        );
      }

      if (input.submit && !input.body) {
        throw new GraphQLError(
          'You cannot submit an incomplete post. Post does not have a body',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              http: { status: 422 },
              errors: {
                body: ['The post dooes not have a body.'],
              },
            },
          },
        );
      }

      let submitted_at,
        published_at = null;

      if (input.title && input.body && input.submit) {
        submitted_at = new Date();
      }

      if (submitted_at && authenticatedUser.is_admin) {
        published_at = new Date();
      }

      const post = await Post.create({
        title: input.title,
        body: input.body,
        user_id: authenticatedUser._id,
        submitted_at,
        published_at,
        meta: {
          views: 0,
        },
      });

      post.user = authenticatedUser;

      // TODO: dispatch job to send notification to admins on new posts to be published or published

      return post;
    },
    async updatePost(
      _,
      { id, input: { title, body } },
      { authenticatedUser },
    ): Promise<PostInterface> {
      if (!title && !body) {
        throw new GraphQLError('No data to update.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 400 },
          },
        });
      }

      const post = await Post.findById(id).populate('user').exec();

      PostPolicy.update(authenticatedUser, post);

      post.title = title || post.title;
      post.body = body || post.body;

      await post.save();

      return post;
    },
    async deletePost(_, { id }, { authenticatedUser }): Promise<PostInterface> {
      const post = await Post.findById(id).populate('user').exec();

      PostPolicy.destroy(authenticatedUser, post);

      await post.deleteOne();

      return post;
    },
    async submitPost(_, { id }, { authenticatedUser }): Promise<PostInterface> {
      const post = await Post.findById(id).populate('user').exec();

      PostPolicy.submit(authenticatedUser, post);

      const submitted_at = new Date();
      let published_at = null;

      if (post.user.is_admin) {
        published_at = submitted_at;
      }

      post.submitted_at = submitted_at;
      post.published_at = published_at;

      await post.save();

      // TODO: dispatch job to send notification to admins on new posts to be published or published

      return post;
    },
    async publishPost(
      _,
      { id },
      { authenticatedUser },
    ): Promise<PostInterface> {
      const post = await Post.findById(id).populate('user').exec();

      PostPolicy.publish(authenticatedUser, post);

      post.published_at = new Date();

      await post.save();

      // TODO: dispatch job to send notification to user published post

      return post;
    },
  },
  AuthUser: {
    async posts(user, { filter }): Promise<Array<PostInterface>> {
      const query: {
        title?: any;
        submitted_at?: any;
        published_at?: any;
        user_id?: any;
      } = getQueryFilter(filter);

      query.user_id = user.id;

      return await Post.find(query).sort(getQuerySorters(filter)).exec();
    },
  },
};
