import { MockResponse } from './testUtils';
import { corsWrapper } from './cors';

describe('test corsWrapper', () => {

  beforeAll(() => {
    global.Response = MockResponse
  });

  afterAll(() => {
    delete global.Response;
  });

  it('should send cors headers in response', async () => {
    const rawRes = new Response("dummy response");
    const mockHandler = jest.fn();
    mockHandler.mockResolvedValue(rawRes);

    const res = await corsWrapper(mockHandler);

    expect(res.body).toBe(rawRes.body);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Vary')).toBe('Origin');
  });
});