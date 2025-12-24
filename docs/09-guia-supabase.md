# Guía: Configuración de Supabase para OrientaFuturo

## 1. Crear Proyecto en Supabase

### Paso 1: Acceder a Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"** o **"Sign In"**
3. Inicia sesión con GitHub, GitLab o email

### Paso 2: Crear nuevo proyecto
1. En el dashboard, haz clic en **"New Project"**
2. Selecciona tu organización (o crea una nueva)
3. Rellena los datos:
   - **Name**: `orientafuturo` (o `orientafuturo-dev` para desarrollo)
   - **Database Password**: Genera una contraseña segura y **guárdala**
   - **Region**: Selecciona la más cercana (ej: `West EU (Ireland)` para España)
   - **Pricing Plan**: Free tier para empezar
4. Haz clic en **"Create new project"**
5. Espera ~2 minutos mientras se crea

---

## 2. Ejecutar las Migraciones

### Opción A: Desde el SQL Editor (Recomendado para empezar)

1. En el menú lateral, ve a **"SQL Editor"**
2. Haz clic en **"New query"**

#### Migración 1: Esquema inicial
3. Copia todo el contenido de `supabase/migrations/00001_initial_schema.sql`
4. Pégalo en el editor SQL
5. Haz clic en **"Run"** (o Ctrl+Enter)
6. Verifica que aparezca "Success" abajo

#### Migración 2: Políticas RLS
7. Crea una nueva query (**"New query"**)
8. Copia todo el contenido de `supabase/migrations/00002_rls_policies.sql`
9. Pégalo y ejecuta con **"Run"**

#### Migración 3: Funciones
10. Crea otra nueva query
11. Copia todo el contenido de `supabase/migrations/00003_functions.sql`
12. Pégalo y ejecuta con **"Run"**

#### Seeds (Datos de prueba)
13. Crea otra nueva query
14. Copia todo el contenido de `supabase/seed.sql`
15. Pégalo y ejecuta con **"Run"**

### Opción B: Usando Supabase CLI (Avanzado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Vincular proyecto existente
supabase link --project-ref TU_PROJECT_REF

# Ejecutar migraciones
supabase db push
```

---

## 3. Verificar la Instalación

### Comprobar tablas creadas

1. Ve a **"Table Editor"** en el menú lateral
2. Deberías ver todas las tablas:
   - `centers`
   - `profiles`
   - `students`
   - `guardian_links`
   - `companies`
   - `plans`
   - `plan_items`
   - `plan_tasks`
   - `events`
   - `event_registrations`
   - `event_feedback`
   - `resources`
   - `resource_tags`
   - `saved_resources`
   - `threads`
   - `thread_participants`
   - `messages`
   - `invitations`
   - `formative_options`
   - `feedback_reports`
   - `error_reports`
   - `audit_logs`

### Comprobar datos de seed

1. Haz clic en la tabla `centers`
2. Deberías ver 3 centros de ejemplo
3. Haz clic en `formative_options`
4. Deberías ver ~10 opciones formativas

### Comprobar políticas RLS

1. Ve a **"Authentication"** → **"Policies"**
2. Selecciona una tabla (ej: `profiles`)
3. Deberías ver las políticas creadas

---

## 4. Obtener Credenciales para el Frontend

### Paso 1: Ir a Settings
1. En el menú lateral, ve a **"Project Settings"** (icono de engranaje)
2. Haz clic en **"API"**

### Paso 2: Copiar credenciales
Necesitas estos valores:

| Variable | Dónde encontrarla |
|----------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (ej: `https://xxxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project API keys → `anon` `public` |

### Paso 3: Crear archivo .env.local
En la raíz del proyecto frontend:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Deepseek (para Fase 2)
DEEPSEEK_API_KEY=sk-...
```

---

## 5. Configurar Autenticación

### Habilitar proveedores de auth

1. Ve a **"Authentication"** → **"Providers"**
2. **Email** ya está habilitado por defecto
3. (Opcional) Habilita otros proveedores si los necesitas

### Configurar emails

1. Ve a **"Authentication"** → **"Email Templates"**
2. Personaliza las plantillas:
   - **Confirm signup**: Email de verificación
   - **Reset password**: Recuperar contraseña
   - **Magic link**: Login sin contraseña

### Configurar URL de redirección

1. Ve a **"Authentication"** → **"URL Configuration"**
2. Añade tu URL de desarrollo:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`

---

## 6. Configurar Storage (Archivos)

### Crear buckets

1. Ve a **"Storage"** en el menú lateral
2. Haz clic en **"New bucket"**
3. Crea estos buckets:

| Bucket | Public | Descripción |
|--------|--------|-------------|
| `avatars` | ✅ Sí | Fotos de perfil |
| `evidence` | ❌ No | Evidencias de tareas (privado) |
| `resources` | ✅ Sí | Archivos de recursos |
| `company-logos` | ✅ Sí | Logos de empresas |
| `event-images` | ✅ Sí | Imágenes de eventos |

### Políticas de storage

Para el bucket `evidence` (privado), añade políticas:

1. Haz clic en el bucket `evidence`
2. Ve a **"Policies"**
3. Crea política para SELECT:
```sql
-- Los alumnos pueden ver sus propias evidencias
CREATE POLICY "Students can view own evidence"
ON storage.objects FOR SELECT
USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
```

4. Crea política para INSERT:
```sql
-- Los alumnos pueden subir evidencias a su carpeta
CREATE POLICY "Students can upload own evidence"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 7. Crear Usuario Admin Inicial

### Desde el dashboard

1. Ve a **"Authentication"** → **"Users"**
2. Haz clic en **"Add user"** → **"Create new user"**
3. Rellena:
   - Email: `admin@orientafuturo.es`
   - Password: (genera una segura)
   - ✅ Auto Confirm User
4. Haz clic en **"Create user"**
5. Copia el **User UID** que aparece

### Crear perfil de admin

1. Ve a **"SQL Editor"**
2. Ejecuta (reemplaza el UUID):

```sql
INSERT INTO profiles (id, role, first_name, last_name, email, is_active, email_verified, onboarding_completed)
VALUES (
  'PEGA-AQUI-EL-UUID-DEL-USUARIO',
  'admin',
  'Admin',
  'Sistema',
  'admin@orientafuturo.es',
  true,
  true,
  true
);
```

---

## 8. Crear Usuario de Prueba (Tutor)

Repite el proceso para crear un tutor de prueba:

1. Crear usuario en Authentication:
   - Email: `tutor@iestecnologico.es`
   - Auto Confirm: ✅

2. Crear perfil:
```sql
INSERT INTO profiles (id, role, center_id, first_name, last_name, email, is_active, email_verified, onboarding_completed)
VALUES (
  'UUID-DEL-TUTOR',
  'tutor',
  '11111111-1111-1111-1111-111111111111', -- IES Tecnológico Madrid
  'María',
  'García',
  'tutor@iestecnologico.es',
  true,
  true,
  true
);
```

---

## 9. Verificación Final

### Checklist

- [ ] Proyecto creado en Supabase
- [ ] 22 tablas creadas correctamente
- [ ] Políticas RLS activas
- [ ] Funciones creadas
- [ ] Datos de seed insertados
- [ ] Buckets de storage creados
- [ ] Usuario admin creado
- [ ] Credenciales copiadas a `.env.local`

### Test rápido desde SQL Editor

```sql
-- Verificar centros
SELECT * FROM centers;

-- Verificar opciones formativas
SELECT name, category FROM formative_options;

-- Verificar funciones
SELECT public.generate_invitation_code();
```

---

## Troubleshooting

### Error: "permission denied for table X"
- Verifica que las políticas RLS están creadas
- Asegúrate de estar autenticado

### Error: "function X does not exist"
- Ejecuta la migración `00003_functions.sql`

### Las tablas no aparecen
- Refresca la página (F5)
- Verifica que no hubo errores al ejecutar las migraciones

### Error al ejecutar migración
- Ejecuta las migraciones en orden (00001, 00002, 00003)
- Si hay error, lee el mensaje y corrige
