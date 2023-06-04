import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  logger.debug(`Server is running at http://localhost:${port}`);
});
