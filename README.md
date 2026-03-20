# 🧠 Test AQ-50 Universitario

## Pasos para publicarlo en internet (gratis)

---

### PASO 1 — Crear la base de datos en Supabase

1. Ve a https://supabase.com y crea una cuenta con GitHub
2. Crea un **nuevo proyecto** (elige cualquier nombre, ej: `aq50-test`)
3. Espera a que termine de iniciar (~1 min)
4. Ve al menú izquierdo → **SQL Editor**
5. Pega y ejecuta este SQL para crear las tablas:

```sql
-- Tabla de usuarios
create table users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

-- Tabla de resultados
create table results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  score integer not null,
  cats integer[] not null,
  created_at timestamptz default now(),
  unique(user_id)
);

-- Índice para ranking
create index on results(score desc);
```

6. Ve a **Project Settings → API**
7. Copia estos dos valores (los necesitas en el Paso 3):
   - `Project URL` → esto es tu `SUPABASE_URL`
   - `service_role` secret → esto es tu `SUPABASE_SERVICE_KEY`

---

### PASO 2 — Subir el código a GitHub

1. Crea un repositorio nuevo en https://github.com (ej: `aq50-test`)
2. Sube todos los archivos de esta carpeta:
   ```
   aq50-app/
   ├── api/
   │   ├── login.js
   │   ├── register.js
   │   ├── submit.js
   │   └── ranking.js
   ├── public/
   │   └── index.html
   ├── package.json
   └── vercel.json
   ```
   Puedes arrastrar los archivos directo en GitHub, o usar:
   ```bash
   git init
   git add .
   git commit -m "primera versión"
   git remote add origin https://github.com/TU_USUARIO/aq50-test.git
   git push -u origin main
   ```

---

### PASO 3 — Publicar en Vercel

1. Ve a https://vercel.com y crea cuenta con GitHub
2. Click en **"Add New Project"**
3. Importa tu repositorio `aq50-test`
4. Antes de hacer Deploy, ve a **"Environment Variables"** y agrega:

   | Name | Value |
   |------|-------|
   | `SUPABASE_URL` | (el Project URL de Supabase) |
   | `SUPABASE_SERVICE_KEY` | (el service_role key de Supabase) |

5. Click en **Deploy** 🚀

En ~1 minuto tendrás una URL pública tipo:
`https://aq50-test.vercel.app`

---

### ¿Problemas?

- Si el deploy falla, revisa que las variables de entorno estén bien copiadas
- Si la base de datos no responde, verifica que ejecutaste el SQL del Paso 1
- Vercel y Supabase tienen planes gratuitos más que suficientes para esto
