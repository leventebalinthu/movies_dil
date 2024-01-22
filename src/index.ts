import config from './config';
import application from './application';
import logger from './lib/logger';


['uncaughtException', 'unhandledRejection', 'exit'].forEach((event: any) => {
  process.on(event, () => {
    logger.info('Unhandled rejection');
    process.exit(1);
  });
});

const apiServerPromise = new Promise<void>((resolve, reject) => {
  application
    .on('error', reject)
    .listen(config.server.port, () => {
      logger.info(`Server start. Listening on http://0.0.0.0:${ config.server.port }${ config.server.baseUrl }`);
      resolve();
    });
});

Promise.all([
  apiServerPromise
]).then(() => {
  logger.info('Server started', config.server.port, config.server.baseUrl);
}).catch(err => {
  logger.info('Unable to start service', config.server.port, config.server.baseUrl);
  process.exit(1);
});
