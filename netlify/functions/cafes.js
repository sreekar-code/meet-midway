const https = require('https');

exports.handler = async (event) => {
  const { lat, lng } = event.queryStringParameters || {};

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid lat/lng' }) };
  }

  const apiKey = process.env.GEOAPIFY_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  const url = `https://api.geoapify.com/v2/places`
    + `?categories=catering.cafe`
    + `&filter=circle:${lng},${lat},2000`
    + `&limit=20`
    + `&apiKey=${apiKey}`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: { 'Content-Type': 'application/json' },
          body: data,
        });
      });
    }).on('error', () => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch cafes' }) });
    });
  });
};
