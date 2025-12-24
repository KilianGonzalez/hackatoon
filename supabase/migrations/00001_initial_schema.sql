-- ============================================
-- OrientaFuturo - Migración Inicial
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: centers (Centros Educativos)
-- ============================================
CREATE TABLE centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  type TEXT NOT NULL DEFAULT 'secondary' CHECK (type IN ('secondary', 'vocational', 'mixed')),
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  autonomous_community TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_centers_province ON centers(province);
CREATE INDEX idx_centers_active ON centers(is_active) WHERE is_active = true;

-- ============================================
-- TABLA: profiles (Usuarios Base)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'family', 'tutor', 'company', 'admin')),
  center_id UUID REFERENCES centers(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  notification_preferences JSONB DEFAULT '{"email": true, "push": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_center ON profiles(center_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_active ON profiles(is_active) WHERE is_active = true;

-- ============================================
-- TABLA: students (Datos Específicos de Alumnos)
-- ============================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  center_id UUID NOT NULL REFERENCES centers(id),
  current_grade TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  group_name TEXT,
  interests TEXT[] DEFAULT '{}',
  interest_scores JSONB,
  preferred_path TEXT,
  preferred_families TEXT[] DEFAULT '{}',
  questionnaire_completed BOOLEAN DEFAULT false,
  questionnaire_completed_at TIMESTAMPTZ,
  assigned_tutor_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_students_profile ON students(profile_id);
CREATE INDEX idx_students_center ON students(center_id);
CREATE INDEX idx_students_grade ON students(current_grade);
CREATE INDEX idx_students_tutor ON students(assigned_tutor_id);
CREATE INDEX idx_students_interests ON students USING GIN(interests);

-- ============================================
-- TABLA: guardian_links (Vinculación Familia-Alumno)
-- ============================================
CREATE TABLE guardian_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL CHECK (relationship IN ('father', 'mother', 'legal_guardian', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  link_method TEXT NOT NULL DEFAULT 'code' CHECK (link_method IN ('code', 'manual', 'invitation')),
  link_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(guardian_id, student_id)
);

CREATE INDEX idx_guardian_links_guardian ON guardian_links(guardian_id);
CREATE INDEX idx_guardian_links_student ON guardian_links(student_id);
CREATE INDEX idx_guardian_links_status ON guardian_links(status);

-- ============================================
-- TABLA: companies (Empresas Colaboradoras)
-- ============================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  trade_name TEXT,
  cif TEXT UNIQUE,
  sector TEXT,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_companies_profile ON companies(profile_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_sector ON companies(sector);

-- ============================================
-- TABLA: plans (Planes de Orientación)
-- ============================================
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  center_id UUID NOT NULL REFERENCES centers(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  objective TEXT,
  start_date DATE,
  target_end_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_plans_student ON plans(student_id);
CREATE INDEX idx_plans_center ON plans(center_id);
CREATE INDEX idx_plans_status ON plans(status);

-- ============================================
-- TABLA: plan_items (Hitos del Plan)
-- ============================================
CREATE TABLE plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_plan_items_plan ON plan_items(plan_id);
CREATE INDEX idx_plan_items_status ON plan_items(status);
CREATE INDEX idx_plan_items_position ON plan_items(plan_id, position);

-- ============================================
-- TABLA: events (Eventos)
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID REFERENCES centers(id),
  company_id UUID REFERENCES companies(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('talk', 'workshop', 'visit', 'open_day', 'fair', 'tutoring')),
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  location TEXT,
  is_online BOOLEAN DEFAULT false,
  online_url TEXT,
  max_attendees INTEGER,
  registration_deadline TIMESTAMPTZ,
  target_grades TEXT[] DEFAULT '{}',
  target_interests TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'published', 'cancelled', 'completed')),
  approval_notes TEXT,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT event_organizer_check CHECK (
    (center_id IS NOT NULL) OR (company_id IS NOT NULL)
  )
);

CREATE INDEX idx_events_center ON events(center_id);
CREATE INDEX idx_events_company ON events(company_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_datetime ON events(start_datetime);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_grades ON events USING GIN(target_grades);

-- ============================================
-- TABLA: resources (Recursos y Artículos)
-- ============================================
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID REFERENCES centers(id),
  company_id UUID REFERENCES companies(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  summary TEXT,
  content TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('guide', 'article', 'video', 'infographic', 'faq', 'external_link')),
  audience TEXT NOT NULL DEFAULT 'all' CHECK (audience IN ('all', 'students', 'families', 'tutors')),
  featured_image_url TEXT,
  video_url TEXT,
  attachment_url TEXT,
  external_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'archived')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_resources_center ON resources(center_id);
CREATE INDEX idx_resources_company ON resources(company_id);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_audience ON resources(audience);
CREATE INDEX idx_resources_slug ON resources(slug);

-- ============================================
-- TABLA: plan_tasks (Tareas de cada Hito)
-- Nota: Creada después de resources y events para las FK
-- ============================================
CREATE TABLE plan_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_item_id UUID NOT NULL REFERENCES plan_items(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL DEFAULT 'general' CHECK (task_type IN ('general', 'reading', 'questionnaire', 'event', 'deliverable', 'meeting')),
  linked_resource_id UUID REFERENCES resources(id),
  linked_event_id UUID REFERENCES events(id),
  position INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES profiles(id),
  evidence_url TEXT,
  evidence_notes TEXT,
  tutor_feedback TEXT,
  tutor_feedback_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_plan_tasks_item ON plan_tasks(plan_item_id);
CREATE INDEX idx_plan_tasks_status ON plan_tasks(status);
CREATE INDEX idx_plan_tasks_type ON plan_tasks(task_type);

-- ============================================
-- TABLA: event_registrations (Inscripciones a Eventos)
-- ============================================
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'waitlist', 'cancelled', 'attended', 'no_show')),
  waitlist_position INTEGER,
  attended BOOLEAN,
  attended_marked_by UUID REFERENCES profiles(id),
  attended_marked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  cancelled_at TIMESTAMPTZ,
  UNIQUE(event_id, student_id)
);

CREATE INDEX idx_event_regs_event ON event_registrations(event_id);
CREATE INDEX idx_event_regs_student ON event_registrations(student_id);
CREATE INDEX idx_event_regs_status ON event_registrations(status);

-- ============================================
-- TABLA: event_feedback (Feedback de Eventos)
-- ============================================
CREATE TABLE event_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  would_recommend BOOLEAN,
  learned_something_new BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, student_id)
);

CREATE INDEX idx_event_feedback_event ON event_feedback(event_id);
CREATE INDEX idx_event_feedback_rating ON event_feedback(rating);

-- ============================================
-- TABLA: resource_tags (Tags de Recursos)
-- ============================================
CREATE TABLE resource_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(resource_id, tag)
);

CREATE INDEX idx_resource_tags_resource ON resource_tags(resource_id);
CREATE INDEX idx_resource_tags_tag ON resource_tags(tag);

-- ============================================
-- TABLA: saved_resources (Recursos Guardados)
-- ============================================
CREATE TABLE saved_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, resource_id)
);

CREATE INDEX idx_saved_resources_profile ON saved_resources(profile_id);

-- ============================================
-- TABLA: threads (Hilos de Mensajería)
-- ============================================
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT,
  context_type TEXT CHECK (context_type IN ('general', 'plan', 'event', 'proposal')),
  context_id UUID,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_message_at TIMESTAMPTZ
);

CREATE INDEX idx_threads_context ON threads(context_type, context_id);
CREATE INDEX idx_threads_last_message ON threads(last_message_at DESC);

-- ============================================
-- TABLA: thread_participants (Participantes de Hilos)
-- ============================================
CREATE TABLE thread_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ,
  is_archived BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(thread_id, profile_id)
);

CREATE INDEX idx_thread_participants_thread ON thread_participants(thread_id);
CREATE INDEX idx_thread_participants_profile ON thread_participants(profile_id);

-- ============================================
-- TABLA: messages (Mensajes)
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- ============================================
-- TABLA: invitations (Invitaciones)
-- ============================================
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'family', 'tutor')),
  center_id UUID NOT NULL REFERENCES centers(id),
  code TEXT UNIQUE NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_code ON invitations(code);
CREATE INDEX idx_invitations_center ON invitations(center_id);
CREATE INDEX idx_invitations_status ON invitations(status);

-- ============================================
-- TABLA: formative_options (Catálogo de Opciones Formativas)
-- ============================================
CREATE TABLE formative_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('bachillerato', 'fp_basica', 'fp_medio', 'fp_superior', 'university', 'other')),
  family TEXT,
  name TEXT NOT NULL,
  official_code TEXT,
  description TEXT,
  duration TEXT,
  access_requirements TEXT,
  minimum_grade TEXT,
  career_opportunities TEXT[],
  further_studies TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_formative_options_category ON formative_options(category);
CREATE INDEX idx_formative_options_family ON formative_options(family);

-- ============================================
-- TABLA: feedback_reports (Feedback de Usuarios)
-- ============================================
CREATE TABLE feedback_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id),
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('bug', 'suggestion', 'complaint', 'praise', 'other')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  page_url TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'resolved', 'wont_fix', 'duplicate')),
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_feedback_type ON feedback_reports(feedback_type);
CREATE INDEX idx_feedback_status ON feedback_reports(status);
CREATE INDEX idx_feedback_reporter ON feedback_reports(reporter_id);

-- ============================================
-- TABLA: error_reports (Errores del Sistema)
-- ============================================
CREATE TABLE error_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  page_url TEXT,
  user_agent TEXT,
  request_data JSONB,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved', 'ignored')),
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_error_reports_type ON error_reports(error_type);
CREATE INDEX idx_error_reports_status ON error_reports(status);
CREATE INDEX idx_error_reports_created ON error_reports(created_at DESC);

-- ============================================
-- TABLA: audit_logs (Logs de Auditoría)
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  user_role TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- FUNCIÓN: Actualizar timestamp de updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_centers_updated_at BEFORE UPDATE ON centers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guardian_links_updated_at BEFORE UPDATE ON guardian_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plan_items_updated_at BEFORE UPDATE ON plan_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plan_tasks_updated_at BEFORE UPDATE ON plan_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_threads_updated_at BEFORE UPDATE ON threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_formative_options_updated_at BEFORE UPDATE ON formative_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_reports_updated_at BEFORE UPDATE ON feedback_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
