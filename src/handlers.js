import { key2timestamp } from "./utils";

export async function handleWeather() {
  const data = await WEATHER.list({ limit: 100 });
  const weatherData = data.keys.map(({ name, metadata }) => {
    return { time: key2timestamp(name), ...JSON.parse(metadata.pt) };
  });
  return new Response(JSON.stringify(weatherData), {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}