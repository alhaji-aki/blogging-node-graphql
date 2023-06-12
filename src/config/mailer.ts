import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';

export default async (
  to: string,
  subject: string,
  template = '',
  context = {},
) => {
  try {
    const transporter = nodemailer.createTransport(
      {
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
        secure: process.env.MAIL_SECURE === 'true',
        logger:
          process.env.NODE_ENV === 'development' &&
          process.env.MAIL_LOGGER === 'true',
      },
      {
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      },
    );

    const source = await fs.readFile(path.join(__dirname, template), 'utf8');

    const compiledTemplate = handlebars.compile(source);

    await transporter.sendMail({
      to,
      subject,
      html: compiledTemplate(context),
    });
  } catch (error) {
    throw error;
  }
};
