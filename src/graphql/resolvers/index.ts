import postResolvers from './post.resolver';
import commentResolvers from './comment.resolver';
import userResolvers from './user.resolver';
import { DateTimeISOResolver } from 'graphql-scalars';

const resolvers = {
  DateTime: DateTimeISOResolver,
  Query: {
    ...postResolvers.Query,
    ...commentResolvers.Query,
    ...userResolvers.Query,
  },
  // Mutation: {
  //   ...postResolvers.Mutation,
  //   ...commentResolvers.Mutation,
  //   ...userResolvers.Mutation,
  // },
};

export default resolvers;
