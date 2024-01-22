import { MoviesCachedData } from '../type/Movies';

export default new class MoviesMemoryStore {

  private data: Map<string, MoviesCachedData> = new Map();

  get(key: string): MoviesCachedData {
    return this.data.get(key);
  }

  set(key: string, value: MoviesCachedData) {
    this.data.set(key, value);
  }

};
