# OrientaFuturo - Modelo de Datos

## 1. Diagrama Entidad-Relación (Simplificado)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   centers   │◄──────│  profiles   │──────▶│   students  │
└─────────────┘   1:N └─────────────┘   1:1 └─────────────┘
                            │                      │
                            │                      │
                      ┌─────┴─────┐          ┌─────┴─────┐
                      ▼           ▼          ▼           │
               ┌───────────┐ ┌─────────┐ ┌───────┐       │
               │  threads  │ │  plans  │ │guardian│      │
               │ /messages │ │         │ │_links │◄─────┘
               └───────────┘ └────┬────┘ └───────┘
                                  │
                            ┌─────┴─────┐
                            ▼           ▼
                     ┌───────────┐ ┌───────────┐
                     │plan_items │ │plan_tasks │
                     │  (hitos)  │ │  (tareas) │
                     └───────────┘ └───────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  companies  │──────▶│ proposals   │◄──────│   events    │
└─────────────┘   1:N └─────────────┘       └─────────────┘
                                                   │
                                             ┌─────┴─────┐
                                             ▼           ▼
                                      ┌───────────┐ ┌───────────┐
                                      │event_regs │ │event_feed │
                                      │           │ │   back    │
                                      └───────────┘ └───────────┘

┌─────────────┐       ┌─────────────┐
│  resources  │◄──────│resource_tags│
└─────────────┘   1:N └─────────────┘
```

---

## 2. Esquema de Tablas

### 2.1 Tabla: `centers` (Centros Educativos)

```sql
CREATE TABLE centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Datos básicos
  name TEXT NOT NULL,
  code TEXT UNIQUE,                    -- Código oficial del centro
  type TEXT NOT NULL DEFAULT 'secondary', -- secondary, vocational, mixed
  
  -- Ubicación
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  autonomous_community TEXT,
  
  -- Contacto
  email TEXT,
  phone TEXT,
  website TEXT,
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_centers_province ON centers(province);
CREATE INDEX idx_centers_active ON centers(is_active) WHERE is_active = true;
```

### 2.2 Tabla: `profiles` (Usuarios Base)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Rol y pertenencia
  role TEXT NOT NULL CHECK (role IN ('student', 'family', 'tutor', 'company', 'admin')),
  center_id UUID REFERENCES centers(id),
  
  -- Datos personales
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  
  -- Preferencias
  notification_preferences JSONB DEFAULT '{"email": true, "push": true}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_center ON profiles(center_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_active ON profiles(is_active) WHERE is_active = true;
```

### 2.3 Tabla: `students` (Datos Específicos de Alumnos)

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  center_id UUID NOT NULL REFERENCES centers(id),
  
  -- Datos académicos
  current_grade TEXT NOT NULL,         -- '1eso', '2eso', '3eso', '4eso', '1bach', '2bach', etc.
  academic_year TEXT NOT NULL,         -- '2024-2025'
  group_name TEXT,                     -- '4º A', '4º B'
  
  -- Intereses (resultado de cuestionarios)
  interests TEXT[] DEFAULT '{}',       -- ['informatica', 'ciencias', 'arte']
  interest_scores JSONB,               -- {"informatica": 85, "ciencias": 72, ...}
  
  -- Preferencias formativas
  preferred_path TEXT,                 -- 'bachillerato', 'fp_medio', 'fp_basico'
  preferred_families TEXT[] DEFAULT '{}', -- Familias profesionales de interés
  
  -- Estado del cuestionario
  questionnaire_completed BOOLEAN DEFAULT false,
  questionnaire_completed_at TIMESTAMPTZ,
  
  -- Tutor asignado
  assigned_tutor_id UUID REFERENCES profiles(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_students_profile ON students(profile_id);
CREATE INDEX idx_students_center ON students(center_id);
CREATE INDEX idx_students_grade ON students(current_grade);
CREATE INDEX idx_students_tutor ON students(assigned_tutor_id);
CREATE INDEX idx_students_interests ON students USING GIN(interests);
```

### 2.4 Tabla: `guardian_links` (Vinculación Familia-Alumno)

```sql
CREATE TABLE guardian_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relación
  guardian_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Tipo de relación
  relationship TEXT NOT NULL CHECK (relationship IN ('father', 'mother', 'legal_guardian', 'other')),
  
  -- Estado de aprobación
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Método de vinculación
  link_method TEXT NOT NULL DEFAULT 'code' CHECK (link_method IN ('code', 'manual', 'invitation')),
  link_code TEXT,                      -- Código usado para vincular
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Restricción única
  UNIQUE(guardian_id, student_id)
);

-- Índices
CREATE INDEX idx_guardian_links_guardian ON guardian_links(guardian_id);
CREATE INDEX idx_guardian_links_student ON guardian_links(student_id);
CREATE INDEX idx_guardian_links_status ON guardian_links(status);
```

### 2.5 Tabla: `plans` (Planes de Orientación)

```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Pertenencia
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  center_id UUID NOT NULL REFERENCES centers(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  
  -- Contenido
  title TEXT NOT NULL,
  description TEXT,
  objective TEXT,                      -- Objetivo principal del plan
  
  -- Fechas
  start_date DATE,
  target_end_date DATE,
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  
  -- Progreso calculado
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_plans_student ON plans(student_id);
CREATE INDEX idx_plans_center ON plans(center_id);
CREATE INDEX idx_plans_status ON plans(status);
```

### 2.6 Tabla: `plan_items` (Hitos del Plan)

```sql
CREATE TABLE plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  
  -- Contenido
  title TEXT NOT NULL,
  description TEXT,
  
  -- Orden y jerarquía
  position INTEGER NOT NULL DEFAULT 0,
  
  -- Fechas
  due_date DATE,
  completed_at TIMESTAMPTZ,
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_plan_items_plan ON plan_items(plan_id);
CREATE INDEX idx_plan_items_status ON plan_items(status);
CREATE INDEX idx_plan_items_position ON plan_items(plan_id, position);
```

### 2.7 Tabla: `plan_tasks` (Tareas de cada Hito)

```sql
CREATE TABLE plan_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_item_id UUID NOT NULL REFERENCES plan_items(id) ON DELETE CASCADE,
  
  -- Contenido
  title TEXT NOT NULL,
  description TEXT,
  
  -- Tipo de tarea
  task_type TEXT NOT NULL DEFAULT 'general' 
    CHECK (task_type IN ('general', 'reading', 'questionnaire', 'event', 'deliverable', 'meeting')),
  
  -- Recurso/evento vinculado (opcional)
  linked_resource_id UUID REFERENCES resources(id),
  linked_event_id UUID REFERENCES events(id),
  
  -- Orden
  position INTEGER NOT NULL DEFAULT 0,
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES profiles(id), -- Quién marcó como completada
  
  -- Evidencia (si aplica)
  evidence_url TEXT,
  evidence_notes TEXT,
  
  -- Feedback del tutor
  tutor_feedback TEXT,
  tutor_feedback_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_plan_tasks_item ON plan_tasks(plan_item_id);
CREATE INDEX idx_plan_tasks_status ON plan_tasks(status);
CREATE INDEX idx_plan_tasks_type ON plan_tasks(task_type);
```

### 2.8 Tabla: `companies` (Empresas Colaboradoras)

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Datos de empresa
  company_name TEXT NOT NULL,
  trade_name TEXT,                     -- Nombre comercial
  cif TEXT UNIQUE,
  sector TEXT,
  
  -- Descripción
  description TEXT,
  website TEXT,
  logo_url TEXT,
  
  -- Contacto
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Estado de aprobación
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_companies_profile ON companies(profile_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_sector ON companies(sector);
```

### 2.9 Tabla: `events` (Eventos)

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Organizador
  center_id UUID REFERENCES centers(id),
  company_id UUID REFERENCES companies(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  
  -- Contenido
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('talk', 'workshop', 'visit', 'open_day', 'fair', 'tutoring')),
  
  -- Fecha y lugar
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  location TEXT,
  is_online BOOLEAN DEFAULT false,
  online_url TEXT,
  
  -- Capacidad
  max_attendees INTEGER,
  registration_deadline TIMESTAMPTZ,
  
  -- Audiencia
  target_grades TEXT[] DEFAULT '{}',   -- ['3eso', '4eso']
  target_interests TEXT[] DEFAULT '{}', -- ['informatica', 'sanidad']
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'draft' 
    CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'published', 'cancelled', 'completed')),
  
  -- Si es propuesta de empresa
  approval_notes TEXT,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  
  -- Imagen
  image_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Validación: debe tener centro O empresa
  CONSTRAINT event_organizer_check CHECK (
    (center_id IS NOT NULL AND company_id IS NULL) OR
    (center_id IS NULL AND company_id IS NOT NULL) OR
    (center_id IS NOT NULL AND company_id IS NOT NULL)
  )
);

-- Índices
CREATE INDEX idx_events_center ON events(center_id);
CREATE INDEX idx_events_company ON events(company_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_datetime ON events(start_datetime);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_grades ON events USING GIN(target_grades);
```

### 2.10 Tabla: `event_registrations` (Inscripciones a Eventos)

```sql
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'registered' 
    CHECK (status IN ('registered', 'waitlist', 'cancelled', 'attended', 'no_show')),
  
  -- Posición en lista de espera
  waitlist_position INTEGER,
  
  -- Asistencia
  attended BOOLEAN,
  attended_marked_by UUID REFERENCES profiles(id),
  attended_marked_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  cancelled_at TIMESTAMPTZ,
  
  -- Restricción única
  UNIQUE(event_id, student_id)
);

-- Índices
CREATE INDEX idx_event_regs_event ON event_registrations(event_id);
CREATE INDEX idx_event_regs_student ON event_registrations(student_id);
CREATE INDEX idx_event_regs_status ON event_registrations(status);
```

### 2.11 Tabla: `event_feedback` (Feedback de Eventos)

```sql
CREATE TABLE event_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Valoración
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  
  -- Comentarios
  comment TEXT,
  
  -- Preguntas específicas (opcional)
  would_recommend BOOLEAN,
  learned_something_new BOOLEAN,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Restricción única
  UNIQUE(event_id, student_id)
);

-- Índices
CREATE INDEX idx_event_feedback_event ON event_feedback(event_id);
CREATE INDEX idx_event_feedback_rating ON event_feedback(rating);
```

### 2.12 Tabla: `resources` (Recursos y Artículos)

```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Autor
  center_id UUID REFERENCES centers(id),
  company_id UUID REFERENCES companies(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  
  -- Contenido
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  summary TEXT,
  content TEXT,                        -- Contenido en Markdown
  
  -- Tipo
  resource_type TEXT NOT NULL 
    CHECK (resource_type IN ('guide', 'article', 'video', 'infographic', 'faq', 'external_link')),
  
  -- Audiencia
  audience TEXT NOT NULL DEFAULT 'all' CHECK (audience IN ('all', 'students', 'families', 'tutors')),
  
  -- Multimedia
  featured_image_url TEXT,
  video_url TEXT,
  attachment_url TEXT,
  external_url TEXT,
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'draft' 
    CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'archived')),
  
  -- Si es propuesta de empresa
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  
  -- Métricas
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX idx_resources_center ON resources(center_id);
CREATE INDEX idx_resources_company ON resources(company_id);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_audience ON resources(audience);
CREATE INDEX idx_resources_slug ON resources(slug);
```

### 2.13 Tabla: `resource_tags` (Tags de Recursos)

```sql
CREATE TABLE resource_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  
  UNIQUE(resource_id, tag)
);

-- Índices
CREATE INDEX idx_resource_tags_resource ON resource_tags(resource_id);
CREATE INDEX idx_resource_tags_tag ON resource_tags(tag);
```

### 2.14 Tabla: `saved_resources` (Recursos Guardados)

```sql
CREATE TABLE saved_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(profile_id, resource_id)
);

-- Índices
CREATE INDEX idx_saved_resources_profile ON saved_resources(profile_id);
```

### 2.15 Tabla: `threads` (Hilos de Mensajería)

```sql
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Asunto
  subject TEXT,
  
  -- Contexto (opcional)
  context_type TEXT CHECK (context_type IN ('general', 'plan', 'event', 'proposal')),
  context_id UUID,                     -- ID del plan/evento/propuesta relacionado
  
  -- Estado
  is_archived BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_message_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX idx_threads_context ON threads(context_type, context_id);
CREATE INDEX idx_threads_last_message ON threads(last_message_at DESC);
```

### 2.16 Tabla: `thread_participants` (Participantes de Hilos)

```sql
CREATE TABLE thread_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Estado de lectura
  last_read_at TIMESTAMPTZ,
  is_archived BOOLEAN DEFAULT false,
  
  -- Timestamps
  joined_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(thread_id, profile_id)
);

-- Índices
CREATE INDEX idx_thread_participants_thread ON thread_participants(thread_id);
CREATE INDEX idx_thread_participants_profile ON thread_participants(profile_id);
```

### 2.17 Tabla: `messages` (Mensajes)

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  
  -- Contenido
  content TEXT NOT NULL,
  
  -- Adjuntos
  attachments JSONB DEFAULT '[]'::jsonb, -- [{name, url, type, size}]
  
  -- Estado
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

### 2.18 Tabla: `feedback_reports` (Feedback de Usuarios)

```sql
CREATE TABLE feedback_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Autor
  reporter_id UUID REFERENCES profiles(id),
  
  -- Tipo
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('bug', 'suggestion', 'complaint', 'praise', 'other')),
  
  -- Contenido
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Contexto
  page_url TEXT,
  user_agent TEXT,
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'resolved', 'wont_fix', 'duplicate')),
  
  -- Resolución
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_feedback_type ON feedback_reports(feedback_type);
CREATE INDEX idx_feedback_status ON feedback_reports(status);
CREATE INDEX idx_feedback_reporter ON feedback_reports(reporter_id);
```

### 2.19 Tabla: `error_reports` (Errores del Sistema)

```sql
CREATE TABLE error_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contexto de usuario
  user_id UUID REFERENCES profiles(id),
  
  -- Error
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  
  -- Contexto técnico
  page_url TEXT,
  user_agent TEXT,
  request_data JSONB,
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved', 'ignored')),
  
  -- Resolución
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_error_reports_type ON error_reports(error_type);
CREATE INDEX idx_error_reports_status ON error_reports(status);
CREATE INDEX idx_error_reports_created ON error_reports(created_at DESC);
```

### 2.20 Tabla: `audit_logs` (Logs de Auditoría)

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Actor
  user_id UUID REFERENCES profiles(id),
  user_role TEXT,
  
  -- Acción
  action TEXT NOT NULL,                -- 'create', 'update', 'delete', 'login', 'approve', etc.
  entity_type TEXT NOT NULL,           -- 'profile', 'plan', 'event', etc.
  entity_id UUID,
  
  -- Detalles
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,                      -- IP, user agent, etc.
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- Particionamiento por fecha (recomendado para producción)
-- CREATE TABLE audit_logs (...) PARTITION BY RANGE (created_at);
```

### 2.21 Tabla: `invitations` (Invitaciones)

```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Destino
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'family', 'tutor')),
  center_id UUID NOT NULL REFERENCES centers(id),
  
  -- Código
  code TEXT UNIQUE NOT NULL,
  
  -- Creador
  created_by UUID NOT NULL REFERENCES profiles(id),
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  
  -- Fechas
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_by UUID REFERENCES profiles(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_code ON invitations(code);
CREATE INDEX idx_invitations_center ON invitations(center_id);
CREATE INDEX idx_invitations_status ON invitations(status);
```

### 2.22 Tabla: `formative_options` (Catálogo de Opciones Formativas)

```sql
CREATE TABLE formative_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Clasificación
  category TEXT NOT NULL CHECK (category IN ('bachillerato', 'fp_basica', 'fp_medio', 'fp_superior', 'university', 'other')),
  family TEXT,                         -- Familia profesional (para FP)
  
  -- Contenido
  name TEXT NOT NULL,
  official_code TEXT,
  description TEXT,
  duration TEXT,                       -- "2 años", "2000 horas"
  
  -- Requisitos
  access_requirements TEXT,
  minimum_grade TEXT,
  
  -- Salidas
  career_opportunities TEXT[],
  further_studies TEXT[],
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_formative_options_category ON formative_options(category);
CREATE INDEX idx_formative_options_family ON formative_options(family);
```

---

## 3. Funciones de Utilidad

### 3.1 Actualizar Progreso del Plan

```sql
CREATE OR REPLACE FUNCTION update_plan_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
  new_progress INTEGER;
  plan_id_to_update UUID;
BEGIN
  -- Obtener el plan_id
  SELECT pi.plan_id INTO plan_id_to_update
  FROM plan_items pi
  WHERE pi.id = COALESCE(NEW.plan_item_id, OLD.plan_item_id);
  
  -- Contar tareas
  SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'completed')
  INTO total_tasks, completed_tasks
  FROM plan_tasks pt
  JOIN plan_items pi ON pt.plan_item_id = pi.id
  WHERE pi.plan_id = plan_id_to_update;
  
  -- Calcular progreso
  IF total_tasks > 0 THEN
    new_progress := (completed_tasks * 100) / total_tasks;
  ELSE
    new_progress := 0;
  END IF;
  
  -- Actualizar plan
  UPDATE plans SET 
    progress_percentage = new_progress,
    updated_at = now()
  WHERE id = plan_id_to_update;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_plan_progress
AFTER INSERT OR UPDATE OR DELETE ON plan_tasks
FOR EACH ROW EXECUTE FUNCTION update_plan_progress();
```

### 3.2 Actualizar Último Mensaje del Hilo

```sql
CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE threads SET 
    last_message_at = NEW.created_at,
    updated_at = now()
  WHERE id = NEW.thread_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_thread_last_message
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION update_thread_last_message();
```

### 3.3 Incrementar Contador de Vistas

```sql
CREATE OR REPLACE FUNCTION increment_resource_views(resource_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE resources SET view_count = view_count + 1 WHERE id = resource_uuid;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. Vistas Útiles

### 4.1 Vista: Alumnos con Progreso

```sql
CREATE VIEW v_students_with_progress AS
SELECT 
  s.*,
  p.first_name,
  p.last_name,
  p.email,
  pl.id as plan_id,
  pl.title as plan_title,
  pl.progress_percentage,
  pl.status as plan_status
FROM students s
JOIN profiles p ON s.profile_id = p.id
LEFT JOIN plans pl ON s.id = pl.student_id AND pl.status = 'active';
```

### 4.2 Vista: Eventos Próximos con Inscripciones

```sql
CREATE VIEW v_upcoming_events AS
SELECT 
  e.*,
  c.name as center_name,
  co.company_name,
  COUNT(er.id) as registration_count,
  COUNT(er.id) FILTER (WHERE er.status = 'waitlist') as waitlist_count
FROM events e
LEFT JOIN centers c ON e.center_id = c.id
LEFT JOIN companies co ON e.company_id = co.id
LEFT JOIN event_registrations er ON e.id = er.event_id
WHERE e.start_datetime > now()
  AND e.status = 'published'
GROUP BY e.id, c.name, co.company_name
ORDER BY e.start_datetime;
```
