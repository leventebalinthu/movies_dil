import { NextFunction, Request, Response } from 'express';
import logger from '../lib/logger';

export default async function requestLogger(req: Request, res: Response, next: NextFunction) {
  const logPayload = {
    path: req.path,
    method: req.method,
    headers: req.headers,
    url_parameters: req.params,
    query: req.query,
  };
  logger.info('Request logger', logPayload);
  next();
}
