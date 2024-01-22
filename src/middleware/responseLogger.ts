import { Request, Response } from 'express';
import ControllerResponse from '../controller/base/ControllerResponse';
import logger from '../lib/logger';

export default function responseLogger(
  request: Request,
  controllerResponse: ControllerResponse<unknown>
) {
  const logPayload = {
    path: request.path,
    method: request.method,
    url_parameters: request.params,
    query: request.query,
    status: controllerResponse.status,
  };

  logger.info('Response logger response', logPayload);
  // logger.info('Response logger body', controllerResponse.body);
}
