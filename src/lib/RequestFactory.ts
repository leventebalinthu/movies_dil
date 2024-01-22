import got, { ExtendOptions, Response, RequestError, Headers, Got } from 'got';
import logger from './logger';

export default new class RequestFactory {
  make(options: ExtendOptions): Got {
    return got.extend({
      ...options,
      hooks: {
        beforeRequest: [ options => { this.beforeRequest(options); } ],
        afterResponse: [
          (response: Response) => {
            return this.afterResponse(response);
          }
        ],
        beforeError: [ (error: RequestError) => { return this.beforeError(error); } ],
      },
    });
  }

  private beforeRequest(options) {
    logger.info('RequestFactory request', {
      url: options.url.toString(),
      path: options.url.pathname,
      method: options.method,
    });
    return options;
  }

  private afterResponse(response: Response): Response {
    logger.info('RequestFactory response', {
      url: response.request.options.url.toString(),
      path: response.request.options.url.pathname,
      method: response.request.options.method,
      retries: response.retryCount,
      status: response.statusCode,
    });
    return response;
  }

  private beforeError(error: RequestError): RequestError {
    logger.info('RequestFactory ERROR', error.message, {
      response: error.response && error.response.body || '',
      url: error.options.url.toString(),
      path: error.options.url.pathname,
      method: error.options.method,
      status: error?.response?.statusCode,
      code: error.code,
    });
    return error;
  }
};
