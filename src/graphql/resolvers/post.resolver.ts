import { GraphQLError } from 'graphql';
import Post, { Post as PostInterface } from '../../models/Post';

function canViewPost(user, post) {
  if (post.user.suspended()) {
    return false;
  }

  if (!user && !post.published()) {
    return false;
  }

  if ((post.user_id !== user.id || !user.is_admin) && !post.published()) {
    return false;
  }

  return true;
}

export default {
  Query: {
    // async getAuthenticatedUsersPosts() {
    // TODO: add filters {search, status} and sorters {order by views or latest}
    // TODO: get all posts for the authenticated user
    // TODO: this endpoint cannot contain comments of the posts
    // },
    async getPosts(): Promise<Array<PostInterface>> {
      // TODO: add filters {search} and sorters {order by views or latest}
      // TODO: this endpoint cannot contain comments of the posts
      // TODO: this should not return posts from suspended users
      return await Post.find({})
        .where('published_at')
        .ne(null)
        .populate('user')
        .exec();
    },
    async getPost(_, { id }, { authenticatedUser }): Promise<PostInterface> {
      const post = await Post.findById(id)
        .populate('user')
        .populate({ path: 'comments', populate: { path: 'user' } })
        .exec();

      if (!post || !canViewPost(authenticatedUser, post)) {
        throw new GraphQLError('Post not found.', {
          extensions: {
            code: 'ITEM_NOT_FOUND',
            http: { status: 404 },
          },
        });
      }

      return post;
    },
  },
  Mutation: {
    // async createPost() {
    //   // TODO:
    // },
    // async updatePost() {
    //   // TODO:
    // },
    // async deletePost() {
    //   // TODO:
    // },
    // async publishPost() {
    //   // TODO:
    // },
  },
};
