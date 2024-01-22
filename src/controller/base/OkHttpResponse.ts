import HttpResponse from './HttpResponse';

export default class OkHttpResponse<T> extends HttpResponse<T> {
  constructor(body: T, headers?: Record<string, string>) {
    super(200, body, headers);
  }
}
