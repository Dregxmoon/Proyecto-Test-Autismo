import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Faltan campos' });

  const { data: user } = await supabase
    .from('users')
    .select('id, name, email, password_hash')
    .eq('email', email.toLowerCase())
    .single();

  if (!user) return res.status(401).json({ error: 'No existe esa cuenta. Regístrate primero.' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const { data: result } = await supabase
    .from('results')
    .select('score, cats, created_at')
    .eq('user_id', user.id)
    .single();

  return res.status(200).json({
    user: { id: user.id, name: user.name, email: user.email },
    result: result || null
  });
}
