import dotenv from 'dotenv';
import logger from './config/logger';
import database from './config/database';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dateScaler from './schema/date.scaler';
import typeDefs from './schema/schema';
import * as postResolvers from './resolvers/post.resolver';

dotenv.config();

async function bootstrap() {
  try {
    await database();
    logger.debug('Connected to database successfully.');
  } catch (error) {
    logger.error('Unable to connect to database', error);
    return;
  }

  try {
    const port = +process.env.PORT || 5000;

    const resolvers = {
      Date: dateScaler,
      Query: {
        ...postResolvers,
      },
    };

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

    logger.debug(`🚀  Server ready at: ${url}`);
  } catch (error) {
    logger.error('Unable to start server', error);
  }
}

bootstrap();
