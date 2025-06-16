import cookieParser from 'cookie-parser';
import getEnvVar from './utils/getEnvVar.js';
import express from 'express';
import router from './routers/index.js';
import dotenv from 'dotenv';
import cors from 'cors';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { UPLOAD_DIR } from './constants.js';
import { pinoHttp } from 'pino-http';

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export function setupServer(params) {
  const app = express();

  app.use(
    express.json({ type: ['application/json', 'application/vnd.api+json'] }),
  );

  app.use(cors({ allowedHeaders: '*' }));

  app.use(pinoHttp({ transport: { target: 'pino-pretty' } }));

  app.use(cookieParser());

  app.use(router);

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('{/*any}', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
}
