import HttpError from '../error/HttpError';
import { NextFunction, Request, Response } from 'express';
import logger from '../lib/logger';

export const isHttpError = (error: unknown): error is HttpError => {
  return (error instanceof Error) && (error as HttpError).statusCode !== undefined && !!(error as HttpError).message;
};

export const applicationErrorHandler = (error: unknown, request: Request, response: Response, next: NextFunction) => {
  let statusCode = 500;
  let errorMessage = 'INTERNAL_ERROR';
  let errorBody: Record<string, any> = { code: errorMessage };
  if (isHttpError(error)) {
    statusCode = error.statusCode;
    errorMessage = error.message;
    errorBody = {
      ...error.body,
      timestamp: Date.now(),
    };
  }
  response.status(statusCode).json(errorBody);
  logger.info('Application error handler response', {
    path: request.path,
    method: request.method,
    headers: request.headers,
    url_parameters: request.params,
    query: request.query,
    status: statusCode,
    errorMessage,
    errorBody: errorBody,
  }, error);
  next();
};
