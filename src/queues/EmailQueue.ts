import Queue from 'bull';
import sendEmail from '../config/mailer';

export default class EmailQueue {
  queue: any;

  constructor() {
    this.queue = new Queue('emails');

    this.queue.process('email', (job) => {
      this.sendEmail(job);
    });
  }

  add(data) {
    this.queue.add('email', data);
  }

  async sendEmail(job) {
    const { to, subject, template, context } = job.data;

    try {
      await sendEmail(to, subject, template, context);
      job.moveToCompleted('done', true);
    } catch (error) {
      if (error.response) {
        job.moveToFailed({ message: 'job failed' });
      }
    }
  }
}
