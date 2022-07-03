import { handleWeather } from './handlers';

class MockResponse {
  constructor(body, init) {
    this.body = body;
    this.init = init;
  }
}

describe('test handleWeather', () => {

  beforeAll(() => {
    global.Response = MockResponse
  });

  afterAll(() => {
    delete global.Response;
  })

  afterEach(() => {
    delete global.WEATHER;
  });

  test('should return response', async () => {
    const keys = [
      { name: '0', metadata: { pt: JSON.stringify({ temperature: 100, humidity: 200 }) } }
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