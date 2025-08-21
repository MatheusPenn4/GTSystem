import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    return res.status(200).json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API FUNCIONANDO!',
      method: req.method
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
