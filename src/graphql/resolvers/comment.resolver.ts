import Post from '../../models/Post';
import Comment, { Comment as CommentInterface } from '../../models/Comment';
import CommentPolicy from '../../policies/comment.policy';

export default {
  Query: {
    // async getPostComments(_, args): Promise<Array<typeof Comment>> {
    //   return await Comment.find({ postId: args.id });
    // },
  },
  Mutation: {
    async createComment(
      _,
      { postId, input: { body } },
      { authenticatedUser },
    ): Promise<CommentInterface> {
      const post = await Post.findById(postId).populate('user').exec();

      CommentPolicy.create(authenticatedUser, post);

      const comment = await Comment.create({
        user_id: authenticatedUser.id,
        post_id: postId,
        body,
      });

      comment.user = authenticatedUser;
      comment.post = post;

      return comment;
    },
    async deleteComment(
      _,
      { id },
      { authenticatedUser },
    ): Promise<CommentInterface> {
      const comment = await Comment.findById(id)
        .populate('post')
        .populate('user')
        .exec();

      CommentPolicy.destroy(authenticatedUser, comment);

      await comment.deleteOne();

      return comment;
    },
  },
};
