import { GraphQLError } from 'graphql';

function throwException(message: string, code: string, status: number) {
  throw new GraphQLError(message, {
    extensions: {
      code,
      http: { status },
    },
  });
}

export default {
  create(user, post): boolean {
    if (!post || !post.published() || post.user.suspended()) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    return true;
  },

  destroy(user, comment): boolean {
    if (!comment) {
      throwException('Comment not found.', 'ITEM_NOT_FOUND', 404);
    }

    if (!user.is_admin && comment.user.id !== user.id) {
      throwException('Comment not found.', 'ITEM_NOT_FOUND', 404);
    }

    return true;
  },
};
