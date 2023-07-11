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
  view(user, post): boolean {
    if (post.user.suspended()) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    if (post.user.id !== user.id && !user.is_admin) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    return true;
  },

  viewPublished(user, post): boolean {
    if (post.user.suspended()) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    if (user && user.suspended()) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    if (!post.published()) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    return true;
  },

  update(user, post): boolean {
    if (!post || post.user.id !== user.id) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    if (post.published()) {
      throwException('You cannot update published posts.', 'UNAUTHORISED', 403);
    }

    return true;
  },

  destroy(user, post): boolean {
    if (!post) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    if (!user.is_admin && post.user.id !== user.id) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    return true;
  },
  submit(user, post): boolean {
    if (!post) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    if (post.user.id !== user.id) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    if (post.published()) {
      throwException(
        'This post has already been published.',
        'UNAUTHORISED',
        403,
      );
    }

    if (!post.completed()) {
      throwException(
        'Post information not completed. Make sure post has a title and body.',
        'UNAUTHORISED',
        403,
      );
    }

    return true;
  },
  publish(user, post): boolean {
    if (!post) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    if (post.user.suspended()) {
      throwException('Post not found.', 'ITEM_NOT_FOUND', 404);
    }

    if (!post.completed()) {
      throwException(
        'Post information not completed. Make sure post has a title and body.',
        'UNAUTHORISED',
        403,
      );
    }

    if (!post.submitted()) {
      throwException(
        'You can only publish submitted posts.',
        'UNAUTHORISED',
        403,
      );
    }

    if (post.published()) {
      throwException(
        'This post has already been published.',
        'UNAUTHORISED',
        403,
      );
    }

    return true;
  },
};
