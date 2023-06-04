import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './config/logger';
import database from './config/database';

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

  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });

  app.listen(port, () => {
    logger.debug(`Server is running at http://localhost:${port}`);
  });
}

bootstrap();
