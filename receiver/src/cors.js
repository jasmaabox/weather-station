
export async function corsWrapper(handler) {
  const res = await handler();
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.append('Vary', 'Origin');
  return res;
}