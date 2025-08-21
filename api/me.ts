import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock user data
    const user = {
      id: 'admin-123',
      name: 'Admin',
      email: 'admin@gtsystem.com',
      role: 'admin',
      avatar: null,
      companyId: null,
      companyName: null
    };

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno' });
  }
}
