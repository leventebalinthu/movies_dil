import Controller from '../base/Controller';
import ControllerResponse from '../base/ControllerResponse';
import OkHttpResponse from '../base/OkHttpResponse';
import moviesService from '../../service/MoviesService';
import BadRequestHttpError from '../../error/BadRequestHttpError';
import { Movies } from '../../type/Movies';
import { Request } from 'express';

export default class MoviesController implements Controller {
  constructor(
    readonly request: Request
  ) {}

  async handle(): Promise<ControllerResponse<Movies>> {
    const { searchParam, pageParam } = this.validate();
    const moviesServiceResponse: Movies = await moviesService.get(searchParam, pageParam);
    return new OkHttpResponse<Movies>(moviesServiceResponse);
  }

  private validate(): {searchParam: string, pageParam: number | undefined} {
    const searchQueryParam = this.request.query.search;
    if (!searchQueryParam || typeof searchQueryParam !== 'string' || searchQueryParam.length < 3) {
      throw new BadRequestHttpError('The search query param is obligatory and has to be longer than 2 characters.');
    }

    const pageQueryParam = this.request.query.page;
    if (pageQueryParam && isNaN(Number(pageQueryParam))) {
      throw new BadRequestHttpError('The page query param is optional but has to be a valid number.');
    }
    return {
      searchParam: searchQueryParam,
      pageParam: pageQueryParam ? Number(pageQueryParam) : 1,
    };
  }
}
