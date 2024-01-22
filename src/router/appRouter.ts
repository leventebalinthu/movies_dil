import { Request, Response, Router } from 'express';
import { wireController } from '../controller/base/wireController';
import MoviesController from '../controller/app/MoviesController';

const appRouter = Router();
appRouter.get('/movies', wireController(MoviesController));

appRouter.use((request: Request, response: Response) => {
  // Default 404
  response.status(404).json({
    cause: 'NOT_FOUND',
    errorMessage: 'Resource not found',
  });
});


export default appRouter;
