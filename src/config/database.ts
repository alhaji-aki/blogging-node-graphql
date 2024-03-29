import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());

import mongoose from 'mongoose';

export const getConnectionString = (): string => {
  let url = process.env.DB_URL;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const database = process.env.DB_DATABASE;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;

  if (!url) {
    const credentials = username && password ? `${username}:${password}@` : '';
    const address = port ? `${host}:${port}` : host;

    url = `mongodb://${credentials}${address}/${database}`;
  }

  return url;
};

export default async () => {
  const url = getConnectionString();

  return await mongoose.connect(url);
};
