# receiver

Receives weather reports from [weather-reporter](../weather-reporter/) and provides them to
Internet.

## Development

Setup Cloudflare Workers:

```
wrangler kv:namespace create WEATHER --preview
wrangler kv:namespace create WEATHER
```

Create `wrangler.toml` from `wrangler.sample.toml` and fill in with credentials.

Run development server with:

```
yarn dev
```