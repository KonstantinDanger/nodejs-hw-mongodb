import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import getEnvVar from './utils/getEnvVar.js';
import contactsRouter from './routers/contactRoutes.js';

import { pinoHttp } from 'pino-http';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export function setupServer(params) {
  const app = express();

  app.use(
    express.json({ type: ['application/json', 'application/vnd.api+json'] }),
  );

  app.use(cors({ allowedHeaders: '*' }));

  app.use(pinoHttp({ transport: { target: 'pino-pretty' } }));

  app.use(contactsRouter);

  app.use('{/*any}', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
}
