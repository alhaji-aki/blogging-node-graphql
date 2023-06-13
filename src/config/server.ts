import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import jwt from 'jsonwebtoken';
import typeDefs from '../graphql/typeDef';
import resolvers from '../graphql/resolvers';
import { directiveTransformers, directives } from '../graphql/directives';
import User from '../models/User';

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
      const token = (req.headers.authorization || '').split('Bearer ')[1];

      if (!token) {
        return {};
      }

      try {
        const payload = jwt.verify(token, process.env.APP_KEY);

        return { authenticatedUser: await User.findById(payload.id) };
      } catch (error) {
        return {};
      }
    },
  });

  return url;
};
