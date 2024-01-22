import express, { Application } from 'express';
import config from './config';
import cors from 'cors';
import helmet from 'helmet';
import { applicationErrorHandler } from './middleware/applicationErrorHandler';
import requestLogger from './middleware/requestLogger';
import appRouter from './router/appRouter';

const application: Application = express();
application.use(helmet());
application.use(cors());
application.use(express.json());

application.use(requestLogger);
application.use(config.server.baseUrl, appRouter);
application.use(applicationErrorHandler);

export default application;
