import postResolvers from './post.resolver';
import commentResolvers from './comment.resolver';
import userResolvers from './user.resolver';
import authResolvers from './auth.resolver';
import passwordResetResolvers from './password-reset.resolver';
import { DateTimeISOResolver } from 'graphql-scalars';

const resolvers = {
  DateTime: DateTimeISOResolver,
  Status: {
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
    PUBLISHED: 'published',
  },
  GeneralSortBy: {
    PUBLISHED_AT: 'published_at',
    POPULAR: 'popular',
  },
  UserSortBy: {
    PUBLISHED_AT: 'published_at',
    CREATED_AT: 'created_at',
    POPULAR: 'popular',
  },
  SortDirection: {
    ASCENDING: 'asc',
    DESCENDING: 'desc',
  },
  Query: {
    ...authResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...passwordResetResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...userResolvers.Mutation,
  },
  AuthUser: {
    ...postResolvers.AuthUser,
  },
};

export default resolvers;
