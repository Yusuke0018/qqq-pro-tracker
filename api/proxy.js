export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes('finance.yahoo.com')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Yahoo Finance returned ${response.status}` });
    }

    const contentType = response.headers.get('content-type') || '';
    const data = await response.text();

    // Reject non-JSON responses (e.g. HTML error pages)
    if (!contentType.includes('json') && !data.trim().startsWith('{') && !data.trim().startsWith('[')) {
      return res.status(502).json({ error: 'Non-JSON response from Yahoo Finance' });
    }

    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
