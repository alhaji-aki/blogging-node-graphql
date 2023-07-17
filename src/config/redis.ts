import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());

import * as Redis from 'ioredis';

export default function (): Redis.RedisOptions {
  return Object.fromEntries(
    Object.entries({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    }).filter(([_, v]) => v != null || v != undefined),
  );
}
