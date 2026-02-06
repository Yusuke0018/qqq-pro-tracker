export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes('finance.yahoo.com')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });

    const data = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
