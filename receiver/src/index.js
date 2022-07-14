import { Router } from 'tiny-request-router';
import { handleWeather, handleOptions } from './handlers';
import { corsWrapper } from './cors';

const router = new Router()
router.get('/api/v1/weather', handleWeather);

addEventListener('fetch', event => {
  const request = event.request
  const { pathname } = new URL(request.url)

  const match = router.match(request.method, pathname)
  if (match) {
    if (request.method === 'OPTIONS') {
      // Handle CORS preflight requests
      event.respondWith(handleOptions(request));
    } else if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'POST') {
      // Handle requests to the API server
      event.respondWith(corsWrapper(async () => match.handler(request)));
    } else {
      event.respondWith(
        new Response(null, {
          status: 405,
          statusText: 'Method Not Allowed',
        })
      );
    }
  }
});
