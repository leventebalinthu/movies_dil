import MoviesController from './MoviesController';
import BadRequestHttpError from '../../error/BadRequestHttpError';
import moviesService from '../../service/MoviesService';
import { Movies } from '../../type/Movies';
import ControllerResponse from '../base/ControllerResponse';

describe('MoviesController', () => {
  test.each([undefined, null, 'a', 'bc'])('when the search query param is invalid, throws BadRequestHttpError',
    async (searchParam: string) => {
      const mockRequest = {
        query: {
          search: searchParam,
        },
      } as any;
      const controller = new MoviesController(mockRequest);

      await expect(controller.handle())
        .rejects
        .toThrow(BadRequestHttpError);
    });

  test.each(['a', '12a', '[not-a-number]'])('when the page query param is invalid, throws BadRequestHttpError', async (
    pageParam: string
  ) => {
    const mockRequest = {
      query: {
        page: pageParam,
      },
    } as any;
    const controller = new MoviesController(mockRequest);

    await expect(controller.handle())
      .rejects
      .toThrow(BadRequestHttpError);
  });

  test('the page query param is optional, the default value is 1', async () => {
    const mockRequest = {
      query: {
        search: '[valid-search-string]',
      },
    } as any;

    jest.spyOn(moviesService, 'get').mockResolvedValue(undefined);

    const controller = new MoviesController(mockRequest);
    await controller.handle();

    expect(moviesService.get).toHaveBeenCalledTimes(1);
    expect(moviesService.get).toHaveBeenNthCalledWith(1, '[valid-search-string]', 1);
  });

  test.each([
    [1, '[movie-title]'],
    [4, '[other-movie-title]'],
    [10, '[author]']
  ])('when the query params are valid, the moviesService should called and return valid response', async (
    page: number, search: string
  ) => {
    const mockRequest = {
      query: {
        page,
        search,
      },
    } as any;

    const movies: Movies = {
      page: 1,
      results: [],
      total_pages: 3,
      total_results: 10,
    };

    jest.spyOn(moviesService, 'get').mockResolvedValue(movies);

    const controller = new MoviesController(mockRequest);
    const response: ControllerResponse<Movies> = await controller.handle();

    expect(moviesService.get).toHaveBeenCalledTimes(1);
    expect(moviesService.get).toHaveBeenNthCalledWith(1, search, page);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(movies);
  });
});
