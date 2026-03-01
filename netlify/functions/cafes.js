exports.handler = async (event) => {
  const { lat, lng } = event.queryStringParameters || {};

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid lat/lng' }) };
  }

  const apiKey = process.env.GEOAPIFY_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  // Note: Geoapify filter uses lon,lat order (GeoJSON)
  const url = `https://api.geoapify.com/v2/places`
    + `?categories=catering.cafe`
    + `&filter=circle:${lng},${lat},2000`
    + `&limit=20`
    + `&apiKey=${apiKey}`;

  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return {
      statusCode: resp.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch cafes' }) };
  }
};
