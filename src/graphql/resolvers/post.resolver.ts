import Post from '../../models/Post';

export default {
  Query: {
    // async getAuthenticatedUsersPosts() {
    // TODO: add filters {search, status} and sorters {order by views or latest}
    // TODO: get all posts for the authenticated user
    // TODO: this endpoint cannot contain comments of the posts
    // },
    async getPosts(): Promise<Array<typeof Post>> {
      // TODO: add filters {search} and sorters {order by views or latest}
      // TODO: this endpoint cannot contain comments of the posts
      // TODO: this should not return posts from suspended users
      return await Post.find({})
        .where('published_at')
        .ne(null)
        .populate('user')
        .exec();
    },
    async getPost(_, { id }): Promise<typeof Post> {
      // TODO: unauthenticated users can view all published posts
      // TODO: authenticated users can view unpublished posts that are theirs
      // TODO: this endpoint can contain comments of the post
      // TODO: this should not return posts from suspended users
      // TODO: admin can view post from suspended user
      return await Post.findById(id)
        .populate('user')
        .populate({ path: 'comments', populate: { path: 'user' } })
        .exec();
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
