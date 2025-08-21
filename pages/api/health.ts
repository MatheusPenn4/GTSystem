import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    return res.status(200).json({ 
      status: 'success', 
      message: 'API is running - NEW STRUCTURE',
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
