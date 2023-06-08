import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from '../graphql/typeDef';
import resolvers from '../graphql/resolvers';

export default async () => {
  const port = +process.env.PORT || 5000;

  // create an apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV === 'development',
  });

  // start the apollo server
  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  return url;
};
