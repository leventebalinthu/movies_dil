import HttpError from './HttpError';
const errorCode = 'BAD_REQUEST';

export default class BadRequestHttpError extends Error implements HttpError {
  code = errorCode;
  statusCode = 400;
  body = {
    code: errorCode,
    message: 'Bad request.',
  };
  constructor(msg?: string) {
    super(errorCode);

    if (!!msg) {
      this.body.message += ` ${msg}`;
    }
  }
}
