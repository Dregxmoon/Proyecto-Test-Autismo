import { createClient } from '@supabase/supabase-js';

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

  const { user_id, score, cats } = req.body;
  if (!user_id || score === undefined || !cats) return res.status(400).json({ error: 'Faltan datos' });

  const { data: existing } = await supabase
    .from('results')
    .select('id')
    .eq('user_id', user_id)
    .single();

  if (existing) return res.status(409).json({ error: 'Ya completaste el test. Solo se permite un intento.' });

  const { data, error } = await supabase
    .from('results')
    .insert({ user_id, score, cats })
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Error guardando resultado' });

  return res.status(200).json({ result: data });
}
