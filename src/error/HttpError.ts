export default interface HttpError extends Error {
  statusCode: number;
  code: string;
  body?: Record<string, any>;
}
