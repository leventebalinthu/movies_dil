import OkHttpResponse from './OkHttpResponse';

describe('OkHttpResponse', () => {
  test('status code is 200', () => {
    const body = {
      a: '1',
    };
    const headers = { a: '1' };
    const response = new OkHttpResponse(body, headers);

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(body);
    expect(response.headers).toMatchObject(headers);
  });

  test('status code is 200, without cookies', () => {
    const body = {
      a: '1',
    };
    const response = new OkHttpResponse(body);

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(body);
  });
});
