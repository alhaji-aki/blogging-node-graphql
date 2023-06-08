import postResolvers from './post.resolver';
import commentResolvers from './comment.resolver';
import userResolvers from './user.resolver';

export default {
  Query: {
    ...postResolvers.Query,
    ...commentResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};
