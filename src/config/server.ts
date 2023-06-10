import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from '../graphql/typeDef';
import resolvers from '../graphql/resolvers';
import { directiveTransformers, directives } from '../graphql/directives';
import { getAuthenticatedUser } from './auth';

export default async () => {
  const port = +process.env.PORT || 5000;

  let schema = makeExecutableSchema({
    typeDefs: [directives, typeDefs],
    resolvers,
  });

  schema = directiveTransformers.reduce(
    (curSchema, transformer) => transformer(curSchema),
    schema,
  );

  // create an apollo server
  const server = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV === 'development',
  });

  // start the apollo server
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      return { user: await getAuthenticatedUser(req) };
    },
  });

  return url;
};
