import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './config/logger';
import database from './config/database';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await database();
    logger.debug('Connected to database successfully.');
  } catch (error) {
    logger.error('Unable to connect to database', error);
    return;
  }

  app.use(cors());

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: process.env.NODE_ENV === 'development',
    }),
  );

  app.listen(port, () => {
    logger.debug(`Server is running at http://localhost:${port}`);
  });
}

bootstrap();
