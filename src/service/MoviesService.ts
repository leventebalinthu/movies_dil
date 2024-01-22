import RequestFactory from '../lib/RequestFactory';
import config from '../config';
import MemoryStore from '../store/MemoryStore';
import { Movies, MoviesCachedData } from '../type/Movies';
import { Got } from 'got';
import logger from '../lib/logger';

class MoviesService {
  private movieDatabaseInstance: Got;

  async get(search: string, page: number): Promise<Movies> {
    this.movieDatabaseInstance = RequestFactory.make({
      ...config.request,
      prefixUrl: config.movies.db.url,
    });
    return await this.getMovies(search, page);
  }

  private async getMovies(search: string, page: number): Promise<Movies> {
    const moviesFromCache: Movies | undefined = this.getMoviesFromCache(search, page);
    if (moviesFromCache) {
      return moviesFromCache;
    }

    const moviesFromApi: Movies = await this.getMoviesFromApi(search, page);
    this.putMoviesToCache(search, page, moviesFromApi);
    return moviesFromApi;
  }

  private async getMoviesFromApi(search: string, page: number): Promise<Movies> {
    const searchParams = {
      query: search,
      page,
    };

    const movies = await this.movieDatabaseInstance.get<Movies>('movie', {
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.movies.db.authorizationToken}`,
      },
      searchParams: {
        include_adult: false,
        language: 'en-US',
        ...searchParams,
      },
    });

    return movies.body;
  }

  private getMoviesFromCache(search: string, page: number): Movies | undefined {
    const key = this.createMemoryStoreKey(search, page);
    const cachedMovies = MemoryStore.get(key);
    if (!cachedMovies) {
      return undefined;
    }

    const { movies, counter, time } = cachedMovies;
    const timeDiff = Date.now() - time;
    if (timeDiff > config.movies.cacheTimeoutInSec * 1000) {
      return undefined;
    }

    this.putMoviesToCache(search, page, movies, counter + 1);

    return movies;
  }

  private putMoviesToCache(search: string, page: number, movies: Movies, counter = 0) {
    logger.info(`MoviesService putMoviesToCache: search: ${search}, page: ${page}, counter: ${counter}`);
    const key = this.createMemoryStoreKey(search, page);
    const moviesData: MoviesCachedData = {
      movies,
      counter,
      time: Date.now(),
    };
    MemoryStore.set(key, moviesData);
  }

  private createMemoryStoreKey(search: string, page: number): string {
    return `${search}___${page}`;
  }
}

const moviesService = new MoviesService();
export default moviesService;
