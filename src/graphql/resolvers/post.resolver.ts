import { GraphQLError } from 'graphql';
import Post, { Post as PostInterface } from '../../models/Post';
import PostPolicy from '../../policies/post.policy';
import User from '../../models/User';

export default {
  Query: {
    // async getAuthenticatedUsersPosts() {
    // TODO: add filters {search, status} and sorters {order by views or latest}
    // TODO: get all posts for the authenticated user
    // TODO: this endpoint cannot contain comments of the posts
    // },
    async getPosts(): Promise<Array<PostInterface>> {
      // TODO: add filters {search} and sorters {order by views or latest}
      const suspendedUsers = (
        await User.find({}).where('suspended_at').ne(null).select('_id').exec()
      ).map((doc) => doc._id);

      return await Post.find({
        user_id: { $not: { $in: suspendedUsers } },
        published_at: { $not: { $eq: null } },
      })
        .populate('user')
        .exec();
    },
    async getPost(_, { id }, { authenticatedUser }): Promise<PostInterface> {
      const post = await Post.findById(id)
        .populate('user')
        .populate({ path: 'comments', populate: { path: 'user' } })
        .exec();

      PostPolicy.view(authenticatedUser, post);

      // TODO: log post views

      return post;
    },
  },
  Mutation: {
    async createPost(
      _,
      { input: { title, body, submit } },
      { authenticatedUser },
    ): Promise<PostInterface> {
      if (submit && !body) {
        throw new GraphQLError(
          'You cannot submit an incomplete post. Post does not have a body',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              argumentName: 'body',
              http: { status: 422 },
            },
          },
        );
      }

      let submitted_at,
        published_at = null;

      if (title && body && submit) {
        submitted_at = new Date();
      }

      if (submitted_at && authenticatedUser.is_admin) {
        published_at = new Date();
      }

      const post = await Post.create({
        title,
        body,
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
    // async publishPost() {
    //   // TODO:
    // },
    // async submitPost() {
    //   // TODO:
    // },
  },
};
