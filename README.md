# Weather Station

Weather station server

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