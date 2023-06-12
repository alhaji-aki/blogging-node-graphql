import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import logger from './config/logger';
import database from './config/database';
import startServer from './config/server';

dotenvExpand.expand(dotenv.config());

async function bootstrap() {
  try {
    await database();
    logger.debug('Connected to database successfully.');
  } catch (error) {
    logger.error('Unable to connect to database', error);
    return;
  }

  try {
    const url = await startServer();

    logger.debug(`🚀  Server ready at: ${url}`);
  } catch (error) {
    logger.error('Unable to start server', error);
    return;
  }
}

bootstrap();
