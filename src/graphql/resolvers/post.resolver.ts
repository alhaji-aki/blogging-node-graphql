import Post from '../../models/Post';

export default {
  Query: {
    async getAuthenticatedUsersPosts() {
      // TODO:
    },
    async getAuthenticatedUsersPost() {
      // TODO:
    },
    async getPosts(): Promise<Array<typeof Post>> {
      return await Post.find();
    },
    async getPost(_, args): Promise<typeof Post> {
      return await Post.findById(args.id);
    },
    async getUserPosts() {
      // TODO:
    },
  },
  Mutation: {
    async createPost() {
      // TODO:
    },
    async updatePost() {
      // TODO:
    },
    async deletePost() {
      // TODO:
    },
    async publishPost() {
      // TODO:
    },
  },
};
