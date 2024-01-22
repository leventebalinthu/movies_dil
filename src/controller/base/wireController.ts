import Controller from './Controller';
import { NextFunction, Request, Response } from 'express';
import ControllerResponse from './ControllerResponse';
import responseLogger from '../../middleware/responseLogger';

export function wireController<T extends Controller>(controller: { new (req: Request, res: Response): T }) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const controllerInstance: T = new controller(request, response);
    try {
      const controllerResponse: ControllerResponse<unknown> = await controllerInstance.handle();
      responseLogger(request, controllerResponse);
      response.statusCode = controllerResponse.status;
      response.set(controllerResponse.headers);
      response.json(controllerResponse.body);
    } catch (error) {
      next(error);
    }
  };
}
