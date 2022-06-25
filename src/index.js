import { Router } from 'tiny-request-router';
import { handleWeather } from './handlers';

const router = new Router()
router.get('/api/v1/weather', handleWeather)

addEventListener('fetch', event => {
  const request = event.request
  const { pathname } = new URL(request.url)

  const match = router.match(request.method, pathname)
  if (match) {
    event.respondWith(match.handler(match.params))
  }
});
