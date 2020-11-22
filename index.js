import express from 'express';
import routes from './routes/routes.js';
import { promises as fs } from 'fs';
global.fileName = './accounts/accounts.json';
import swaggerUI from 'swagger-ui-express';
import { swag } from './doc.js';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
  format: combine(label({ label: 'Bank-API' }), timestamp(), myFormat),
});
const app = express();
app.use(express.json());
app.use('doc.js', swaggerUI.serve, swaggerUI.setup(swag));
app.use('/accounts', routes);
import winston from 'winston';
app.listen(3002, async () => {
  try {
    await fs.readFile(global.fileName);
  } catch (error) {
    const data = {
      NextAccountId: '1',
      Accounts: [],
    };
    fs.writeFile(global.fileName, JSON.stringify(data))
      .then(() => {
        logger.info('API started!!!');
      })
      .catch((error) => {
        logger.error('This is the error ->' + error);
      });
  }
});
