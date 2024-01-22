import moviesService from './MoviesService';
import RequestFactory from '../lib/RequestFactory';
import MemoryStore from '../store/MemoryStore';
import { Movies, MoviesCachedData } from '../type/Movies';
import logger from '../lib/logger';

describe('MoviesService', () => {

  beforeEach(() => {
    jest.spyOn(logger, 'info').mockImplementation((...args) => {});
  });

  test('RequestFactory make is called with the correct params', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      statusCode: 200,
      body: {},
    });

    jest.spyOn(RequestFactory, 'make').mockReturnValue({
      get: mockGet,
    } as any);

    await moviesService.get('[search]', 1);

    expect(RequestFactory.make).toHaveBeenCalledTimes(1);
    expect(RequestFactory.make).toHaveBeenNthCalledWith(1, {
      prefixUrl: 'test-url',
      retry: {
        limit: 4321,
      },
      timeout: {
        lookup: 1234,
        request: 5678,
      },
    });
  });

  test('when the given key is not in the cache, call the RequestFactory and the MemoryStore set', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      statusCode: 200,
      body: 'test-body',
    });
    jest.spyOn(RequestFactory, 'make').mockReturnValue({
      get: mockGet,
    } as any);

    jest.spyOn(MemoryStore, 'get').mockReturnValue(undefined);
    const storeSetMock = jest.spyOn(MemoryStore, 'set');

    await moviesService.get('[search]', 1);

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenNthCalledWith(1, 'movie', {
      headers: { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' },
      responseType: 'json',
      searchParams: {
        include_adult: false,
        language: 'en-US',
        page: 1,
        query: '[search]',
      },
    });

    expect(MemoryStore.get).toHaveBeenCalledTimes(1);
    expect(MemoryStore.get).toHaveBeenNthCalledWith(1, '[search]___1');

    expect(MemoryStore.set).toHaveBeenCalledTimes(1);

    expect(storeSetMock.mock.calls[0][0]).toEqual('[search]___1');
    expect(storeSetMock.mock.calls[0][1]).toMatchObject({ movies: 'test-body', counter: 0 });
  });

  test('when the given key is in the cache and valid, do not call the RequestFactory, call the MemoryStore set',
    async () => {
      const mockGet = jest.fn().mockResolvedValue({
        statusCode: 200,
        body: {},
      });
      jest.spyOn(RequestFactory, 'make').mockReturnValue({
        get: mockGet,
      } as any);

      const cachedMovies: Movies = {
        page: 1,
        total_pages: 2,
        total_results: 12,
        results: [],
      };
      const getMockData: MoviesCachedData = {
        counter: 0,
        movies: cachedMovies,
        time: Date.now() - 2000,
      };
      jest.spyOn(MemoryStore, 'get').mockReturnValue(getMockData);
      const storeSetMock = jest.spyOn(MemoryStore, 'set');

      await moviesService.get('[search]', 1);

      expect(mockGet).toHaveBeenCalledTimes(0);

      expect(MemoryStore.get).toHaveBeenCalledTimes(1);
      expect(MemoryStore.get).toHaveBeenNthCalledWith(1, '[search]___1');

      expect(MemoryStore.set).toHaveBeenCalledTimes(1);

      expect(storeSetMock.mock.calls[0][0]).toEqual('[search]___1');
      expect(storeSetMock.mock.calls[0][1]).toMatchObject({
        movies: cachedMovies,
        counter: 1,
      });
    });

  test('when the given key is in the cache but invalid, call the RequestFactory, call the MemoryStore set',
    async () => {
      const moviesDbResponseBody: Movies = {
        page: 4,
        total_pages: 3,
        total_results: 15,
        results: [],
      };
      const mockGet = jest.fn().mockResolvedValue({
        statusCode: 200,
        body: moviesDbResponseBody,
      });
      jest.spyOn(RequestFactory, 'make').mockReturnValue({
        get: mockGet,
      } as any);

      const cachedMovies: Movies = {
        page: 2,
        total_pages: 10,
        total_results: 20,
        results: [],
      };
      const getMockData: MoviesCachedData = {
        counter: 0,
        movies: cachedMovies,
        time: Date.now() - 10000,
      };
      jest.spyOn(MemoryStore, 'get').mockReturnValue(getMockData);
      const storeSetMock = jest.spyOn(MemoryStore, 'set');

      await moviesService.get('[search-other]', 4);

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenNthCalledWith(1, 'movie', {
        headers: { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' },
        responseType: 'json',
        searchParams: {
          include_adult: false,
          language: 'en-US',
          page: 4,
          query: '[search-other]',
        },
      });

      expect(MemoryStore.get).toHaveBeenCalledTimes(1);
      expect(MemoryStore.get).toHaveBeenNthCalledWith(1, '[search-other]___4');

      expect(MemoryStore.set).toHaveBeenCalledTimes(1);

      expect(storeSetMock.mock.calls[0][0]).toEqual('[search-other]___4');
      expect(storeSetMock.mock.calls[0][1]).toMatchObject({
        movies: moviesDbResponseBody,
        counter: 0,
      });
    });
});
