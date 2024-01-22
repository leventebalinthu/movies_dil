import ControllerResponse from './ControllerResponse';

export default class HttpResponse<T> implements ControllerResponse<T> {
  constructor(
    readonly status: number,
    readonly body: T,
    readonly headers?: Record<string, string>
  ) {
  }

}
