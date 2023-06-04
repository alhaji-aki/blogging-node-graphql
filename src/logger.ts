import winston, { format, transports } from 'winston';
import colorize from 'json-colorizer';
import path from 'path';

const logFormat = format.printf(
  (info) =>
    `${info.timestamp} ${info.level} [${info.label}]: ${info.message} ${
      !!info.metadata && Object.keys(info.metadata).length > 0
        ? colorize(JSON.stringify(info.metadata, null, 2))
        : ''
    }`,
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
  ],
  exitOnError: false,
});

export default logger;
