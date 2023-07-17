import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());

export default function () {
  return {
    name: process.env.APP_NAME,
    key: process.env.APP_KEY,
    port: +process.env.PORT || 5000,
    environment: process.env.NODE_ENV,
    frontendUrl: process.env.AUTH_FRONTEND_PASSWORD_RESET_URL,
    auth: {
      expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN || '1h',
    },
    password: {
      throttle: +process.env.AUTH_PASSWORD_RESET_THROTTLE || 60,
      expiresIn: +process.env.AUTH_PASSWORD_RESET_EXPIRES_IN || 60,
    },
  };
}
