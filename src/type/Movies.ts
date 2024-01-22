export interface Movie {
  adult: Boolean,
  backdrop_path: string | null,
  genre_ids: number[],
  id: number,
  original_language: string,
  original_title: string,
  overview: string,
  popularity: number,
  poster_path: string,
  release_date: string,
  title: string,
  video: boolean,
  vote_average: number,
  vote_count: number
}
export interface Movies {
  page: number,
  results: Array<Movie>,
  total_pages: number,
  total_results: number
}

export interface MoviesCachedData {
  movies: Movies,
  counter: number
  time: number
}
