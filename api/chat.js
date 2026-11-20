module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, sessionId } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'message field is required' });
    }

    const n8nWebhook = 'https://ibrahimssa52.app.n8n.cloud/webhook/clinic-chat';

    const n8nRes = await fetch(n8nWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sessionId: sessionId || ('web_' + Date.now())
      })
    });

    const data = await n8nRes.json();
    return res.status(n8nRes.status).json(data);
  } catch (err) {
    console.error('Proxy Error to n8n:', err);
    return res.status(502).json({
      error: 'Failed to communicate with clinic n8n backend',
      details: err.message
    });
  }
};
