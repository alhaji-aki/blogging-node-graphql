import mongoose from 'mongoose';

export default async () => {
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

  return await mongoose.connect(url);
};
