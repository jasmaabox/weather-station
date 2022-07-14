import { MockRequest, MockResponse } from './testUtils';
import { handleOptions, handleWeather } from './handlers';

describe('test handleWeather', () => {

  beforeAll(() => {
    global.Response = MockResponse;
  });

  afterAll(() => {
    delete global.Response;
  });

  afterEach(() => {
    delete global.WEATHER;
  });

  it('should return response', async () => {
    const keys = [
      { name: '0', metadata: { temperature: 100, humidity: 200 } }
    ];
    global.WEATHER = {
      list: async () => {
        return { keys };
      }
    };

    const response = await handleWeather();
    const responseJson = JSON.parse(response.body);
    expect(responseJson.length).toBe(1);
    expect(responseJson[0].temperature).toBe(100);
    expect(responseJson[0].humidity).toBe(200);
  });
});

describe('test handleOptions', () => {

  beforeAll(() => {
    global.Request = MockRequest;
    global.Response = MockResponse;
  });

  afterAll(() => {
    delete global.Response;
  });

  it('should handle cors preflight', async () => {
    const req = new Request('dummy request', {
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'DELETE',
        'Access-Control-Request-Headers': 'origin, x-requested-with',
      }
    });

    const res = handleOptions(req);

    expect(res.body).toBe(null);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET,HEAD,POST,OPTIONS');
    expect(res.headers.get('Access-Control-Max-Age')).toBe('86400');
    expect(res.headers.get('Access-Control-Allow-Headers')).toBe('origin, x-requested-with');
  });

  it('should handle non-cors options', async () => {
    const req = new Request('dummy request', {
      headers: {
        'Origin': null,
        'Access-Control-Request-Method': null,
        'Access-Control-Request-Headers': null,
      }
    });

    const res = handleOptions(req);

    expect(res.body).toBe(null);
    expect(res.headers.get('Allow')).toBe('GET, HEAD, POST, OPTIONS');
  });
});