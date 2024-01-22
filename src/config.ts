import * as process from 'process';

const config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    baseUrl: process.env.BASE_URL || '',
  },
  request: {
    timeout: {
      lookup: parseInt(process.env.REQUEST_TIMEOUT_LOOKUP_IN_MS || '20000', 10),
      request: parseInt(process.env.REQUEST_TIMEOUT_REQUEST_IN_MS || '30000', 10),
    },
    retry: {
      limit: parseInt(process.env.REQUEST_RETRY_LIMIT || '2', 10),
    },
  },
  movies: {
    cacheTimeoutInSec: parseInt(process.env.MOVIES_CACHE_TIMEOUT_IN_SEC || '120', 10),
    db: {
      url: process.env.MOVIES_DB_URL || 'https://api.themoviedb.org/3/search',
      authorizationToken: process.env.MOVIES_DB_AUTHORIZATION_TOKEN || 'token',
    },
  },
};

export default config;
