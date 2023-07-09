import Queue from 'bull';
import sendEmail from '../config/mailer';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());

const queue = new Queue('emails', {
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

queue.process('password-reset-job', async (job) => {
  const { email, token } = job.data;

  const url = `${process.env.AUTH_FRONTEND_PASSWORD_RESET_URL}?token=${token}&email=${email}`;

  const appName = process.env.APP_NAME;

  await sendEmail(
    email,
    'Reset Password Notification',
    '../templates/password-reset.hbs',
    {
      url,
      appName,
      expires: process.env.AUTH_PASSWORD_RESET_EXPIRES_IN,
    },
  );
});

export default queue;
