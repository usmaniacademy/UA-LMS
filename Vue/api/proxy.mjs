export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

  const __path = req.query.__path || '';

  const target = new URL(`${backendUrl}/api${__path}`);

  if (req.url.includes('?')) {
    const params = new URLSearchParams(req.url.split('?')[1]);
    params.delete('__path');
    params.forEach((value, key) => target.searchParams.append(key, value));
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);

  const headers = { ...req.headers };
  delete headers.host;
  delete headers['x-vercel-id'];
  delete headers['x-vercel-trace-id'];
  delete headers['x-forwarded-host'];
  delete headers['x-forwarded-proto'];
  delete headers['x-forwarded-for'];

  try {
    const response = await fetch(target.toString(), {
      method: req.method,
      headers: { ...headers, host: new URL(backendUrl).host },
      body: body.length > 0 ? body : undefined,
    });

    const responseBody = await response.text();
    res.status(response.status);
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!['transfer-encoding', 'content-encoding', 'connection'].includes(lower)) {
        res.setHeader(key, value);
      }
    });
    res.send(responseBody);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).json({ error: 'Bad gateway' });
  }
}
