import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function hashPassword(password) {
  return createHash('sha256').update(password + 'aq50salt2024').digest('hex');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json({ error: 'Faltan campos' });
  if (password.length < 6) return res.status(400).json({ error: 'Contraseña muy corta' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: 'Correo inválido' });

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (existing) return res.status(409).json({ error: 'Este correo ya está registrado. Inicia sesión.' });

  const hash = hashPassword(password);
  const { data, error } = await supabase
    .from('users')
    .insert({ name, email: email.toLowerCase(), password_hash: hash })
    .select('id, name, email')
    .single();

  if (error) return res.status(500).json({ error: 'Error creando cuenta: ' + error.message });

  return res.status(200).json({ user: data });
}
