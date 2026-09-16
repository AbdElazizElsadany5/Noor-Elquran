import https from 'https';

export default function handler(req, res) {
  const targetUrl = 'https://stream.radiojar.com/8s5u5tpdtwzuv';

  const request = https.get(targetUrl, (response) => {
    const rawLocation = response.headers.location;
    if (rawLocation) {
      const httpsLocation = rawLocation.replace(/^http:\/\//i, 'https://');
      res.setHeader('Location', httpsLocation);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.status(302).end();
    } else {
      res.setHeader('Location', targetUrl);
      res.status(302).end();
    }
  });

  request.on('error', () => {
    res.setHeader('Location', 'https://n0a.radiojar.com/8s5u5tpdtwzuv');
    res.status(302).end();
  });
}
