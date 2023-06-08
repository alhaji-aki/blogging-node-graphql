import Comment from '../../models/Comment';

export default {
  Query: {
    async getPostComments(_, args): Promise<Array<typeof Comment>> {
      return await Comment.find({ postId: args.id });
    },
  },
  Mutation: {
    async createComment() {
      // TODO:
    },
    async updateComment() {
      // TODO:
    },
    async deleteComment() {
      // TODO:
    },
  },
};
