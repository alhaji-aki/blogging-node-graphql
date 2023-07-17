import Queue from 'bull';
import sendEmail from '../config/mailer';
import appConfig from '../config/app';
import getRedisConfig from '../config/redis';

const config = appConfig();

const queue = new Queue('emails', { redis: getRedisConfig() });

queue.process('password-reset-job', async (job) => {
  const { email, token } = job.data;

  const url = `${config.frontendUrl}?token=${token}&email=${email}`;

  const appName = config.name;

  await sendEmail(
    email,
    'Reset Password Notification',
    '../templates/password-reset.hbs',
    {
      url,
      appName,
      expires: config.password.expiresIn,
    },
  );
});

export default queue;
