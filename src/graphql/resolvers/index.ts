import postResolvers from './post.resolver';
import commentResolvers from './comment.resolver';
import userResolvers from './user.resolver';
import authResolvers from './auth.resolver';
import { DateTimeISOResolver } from 'graphql-scalars';

const resolvers = {
  DateTime: DateTimeISOResolver,
  Query: {
    ...authResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    //   ...postResolvers.Mutation,
    //   ...commentResolvers.Mutation,
    //   ...userResolvers.Mutation,
  },
};

export default resolvers;
