import RequestFactory from './RequestFactory';
import nock from 'nock';
import logger from './logger';

describe('RequestFactory', () => {
  let instance;

  beforeEach(() => {
    instance = RequestFactory.make({});
    jest.spyOn(logger, 'info').mockImplementation((...args) => {});
  });

  test('#make', () => {
    expect(instance).toBeInstanceOf(Function);
  });

  test('#get', async () => {
    const data = 'Hello world!';

    nock('https://test.com')
      .get('/')
      .reply(200, data);

    const response = await instance.get({
      url: 'https://test.com',
      headers: {
        'x-correlation-id': '[correlation-id]',
      },
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(data);
  });

  test('statusCode', async () => {
    nock('https://test.com')
      .get('/')
      .reply(201, 'failure');

    const response = await instance.get('https://test.com/');
    expect(response.statusCode).toEqual(201);
  });

  test('error', async () => {
    const data = 'failure';
    nock('https://test.com')
      .get('/')
      .reply(501, data)
    ;

    let error = undefined;
    try {
      await instance.get({
        url: 'https://test.com',
        headers: {
          'x-correlation-id': ['[correlation-id]', '[other-id]'],
        },
      });
    } catch (err) {
      error = err;
    }
    expect((error as any).response.statusCode).toEqual(501);
    expect((error as any).response.body).toEqual(data);

  });
});
