import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Usuários mockados
  const users: Record<string, any> = {
    'admin@gtsystem.com': {
      id: 'admin-123',
      name: 'Admin',
      email: 'admin@gtsystem.com',
      password: 'admin123',
      role: 'admin'
    }
  };

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha obrigatórios' });
    }

    const user = users[email];
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Token mock
    const token = 'mock-token-' + Date.now();

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      refreshToken: 'refresh-' + Date.now()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno' });
  }
}
