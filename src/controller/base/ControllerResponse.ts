export default interface ControllerResponse<T> {
  status: number;
  body: T;
  headers?: Record<string, string>;
}
