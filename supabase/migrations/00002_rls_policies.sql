-- ============================================
-- OrientaFuturo - Políticas RLS
-- ============================================

-- ============================================
-- FUNCIONES HELPER PARA RLS
-- ============================================

-- Obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Obtener el centro del usuario actual
CREATE OR REPLACE FUNCTION public.current_user_center_id()
RETURNS UUID AS $$
  SELECT center_id FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Verificar si el usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Verificar si el usuario es tutor del centro dado
CREATE OR REPLACE FUNCTION public.is_tutor_of_center(p_center_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role = 'tutor' 
      AND center_id = p_center_id
  )
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Verificar si el usuario (familia) está vinculado al estudiante
CREATE OR REPLACE FUNCTION public.is_guardian_of_student(p_student_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.guardian_links 
    WHERE guardian_id = auth.uid() 
      AND student_id = p_student_id 
      AND status = 'approved'
  )
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Obtener el student_id del usuario actual (si es alumno)
CREATE OR REPLACE FUNCTION public.current_student_id()
RETURNS UUID AS $$
  SELECT id FROM public.students WHERE profile_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Obtener el company_id del usuario actual (si es empresa)
CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS UUID AS $$
  SELECT id FROM public.companies WHERE profile_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ============================================
-- RLS: centers
-- ============================================
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "centers_select_authenticated" ON centers
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "centers_all_admin" ON centers
  FOR ALL TO authenticated USING (public.is_admin());

-- ============================================
-- RLS: profiles
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "profiles_select_tutor_center" ON profiles
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'tutor' 
    AND center_id = public.current_user_center_id()
  );

CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "profiles_insert_service" ON profiles
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================
-- RLS: students
-- ============================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students_select_own" ON students
  FOR SELECT TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "students_select_guardian" ON students
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'family'
    AND public.is_guardian_of_student(id)
  );

CREATE POLICY "students_select_tutor" ON students
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

CREATE POLICY "students_select_admin" ON students
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "students_update_own" ON students
  FOR UPDATE TO authenticated USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "students_update_tutor" ON students
  FOR UPDATE TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

CREATE POLICY "students_update_admin" ON students
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "students_insert_service" ON students
  FOR INSERT TO service_role WITH CHECK (true);

-- ============================================
-- RLS: guardian_links
-- ============================================
ALTER TABLE guardian_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guardian_links_select_guardian" ON guardian_links
  FOR SELECT TO authenticated USING (guardian_id = auth.uid());

CREATE POLICY "guardian_links_select_tutor" ON guardian_links
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = student_id 
        AND s.center_id = public.current_user_center_id()
    )
  );

CREATE POLICY "guardian_links_select_admin" ON guardian_links
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "guardian_links_insert_guardian" ON guardian_links
  FOR INSERT TO authenticated WITH CHECK (
    public.current_user_role() = 'family'
    AND guardian_id = auth.uid()
    AND status = 'pending'
  );

CREATE POLICY "guardian_links_update_tutor" ON guardian_links
  FOR UPDATE TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = student_id 
        AND s.center_id = public.current_user_center_id()
    )
  );

CREATE POLICY "guardian_links_update_admin" ON guardian_links
  FOR UPDATE TO authenticated USING (public.is_admin());

-- ============================================
-- RLS: companies
-- ============================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "companies_select_own" ON companies
  FOR SELECT TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "companies_select_tutor" ON companies
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND status = 'approved'
  );

CREATE POLICY "companies_select_admin" ON companies
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "companies_update_own" ON companies
  FOR UPDATE TO authenticated USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "companies_update_admin" ON companies
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "companies_insert_service" ON companies
  FOR INSERT TO service_role WITH CHECK (true);

-- ============================================
-- RLS: plans
-- ============================================
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_select_student" ON plans
  FOR SELECT TO authenticated USING (
    student_id = public.current_student_id()
  );

CREATE POLICY "plans_select_guardian" ON plans
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'family'
    AND public.is_guardian_of_student(student_id)
  );

CREATE POLICY "plans_select_tutor" ON plans
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

CREATE POLICY "plans_select_admin" ON plans
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "plans_insert_tutor" ON plans
  FOR INSERT TO authenticated WITH CHECK (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
    AND created_by = auth.uid()
  );

CREATE POLICY "plans_update_tutor" ON plans
  FOR UPDATE TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

CREATE POLICY "plans_update_admin" ON plans
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "plans_delete_admin" ON plans
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================
-- RLS: plan_items
-- ============================================
ALTER TABLE plan_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plan_items_select" ON plan_items
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM plans p WHERE p.id = plan_id
      AND (
        p.student_id = public.current_student_id()
        OR public.is_guardian_of_student(p.student_id)
        OR (public.current_user_role() = 'tutor' AND p.center_id = public.current_user_center_id())
        OR public.is_admin()
      )
    )
  );

CREATE POLICY "plan_items_insert_tutor" ON plan_items
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM plans p WHERE p.id = plan_id
      AND (
        (public.current_user_role() = 'tutor' AND p.center_id = public.current_user_center_id())
        OR public.is_admin()
      )
    )
  );

CREATE POLICY "plan_items_update_tutor" ON plan_items
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM plans p WHERE p.id = plan_id
      AND (
        (public.current_user_role() = 'tutor' AND p.center_id = public.current_user_center_id())
        OR public.is_admin()
      )
    )
  );

CREATE POLICY "plan_items_delete_tutor" ON plan_items
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM plans p WHERE p.id = plan_id
      AND (
        (public.current_user_role() = 'tutor' AND p.center_id = public.current_user_center_id())
        OR public.is_admin()
      )
    )
  );

-- ============================================
-- RLS: plan_tasks
-- ============================================
ALTER TABLE plan_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plan_tasks_select" ON plan_tasks
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM plan_items pi
      JOIN plans p ON pi.plan_id = p.id
      WHERE pi.id = plan_item_id
      AND (
        p.student_id = public.current_student_id()
        OR public.is_guardian_of_student(p.student_id)
        OR (public.current_user_role() = 'tutor' AND p.center_id = public.current_user_center_id())
        OR public.is_admin()
      )
    )
  );

CREATE POLICY "plan_tasks_insert_tutor" ON plan_tasks
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM plan_items pi
      JOIN plans p ON pi.plan_id = p.id
      WHERE pi.id = plan_item_id
      AND (
        (public.current_user_role() = 'tutor' AND p.center_id = public.current_user_center_id())
        OR public.is_admin()
      )
    )
  );

CREATE POLICY "plan_tasks_update_student" ON plan_tasks
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM plan_items pi
      JOIN plans p ON pi.plan_id = p.id
      WHERE pi.id = plan_item_id
      AND p.student_id = public.current_student_id()
    )
  );

CREATE POLICY "plan_tasks_update_tutor" ON plan_tasks
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM plan_items pi
      JOIN plans p ON pi.plan_id = p.id
      WHERE pi.id = plan_item_id
      AND (
        (public.current_user_role() = 'tutor' AND p.center_id = public.current_user_center_id())
        OR public.is_admin()
      )
    )
  );

CREATE POLICY "plan_tasks_delete_tutor" ON plan_tasks
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM plan_items pi
      JOIN plans p ON pi.plan_id = p.id
      WHERE pi.id = plan_item_id
      AND (
        (public.current_user_role() = 'tutor' AND p.center_id = public.current_user_center_id())
        OR public.is_admin()
      )
    )
  );

-- ============================================
-- RLS: events
-- ============================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_published" ON events
  FOR SELECT TO authenticated USING (
    status = 'published'
    AND (
      center_id = (SELECT center_id FROM students WHERE profile_id = auth.uid())
      OR center_id = public.current_user_center_id()
      OR public.current_user_role() = 'family'
    )
  );

CREATE POLICY "events_select_tutor" ON events
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

CREATE POLICY "events_select_company" ON events
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
  );

CREATE POLICY "events_select_admin" ON events
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "events_insert_tutor" ON events
  FOR INSERT TO authenticated WITH CHECK (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
    AND created_by = auth.uid()
  );

CREATE POLICY "events_insert_company" ON events
  FOR INSERT TO authenticated WITH CHECK (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
    AND status = 'pending_approval'
    AND created_by = auth.uid()
  );

CREATE POLICY "events_update_tutor" ON events
  FOR UPDATE TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

CREATE POLICY "events_update_company" ON events
  FOR UPDATE TO authenticated USING (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
    AND status IN ('pending_approval', 'draft')
  );

CREATE POLICY "events_all_admin" ON events
  FOR ALL TO authenticated USING (public.is_admin());

-- ============================================
-- RLS: event_registrations
-- ============================================
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_regs_select_student" ON event_registrations
  FOR SELECT TO authenticated USING (
    student_id = public.current_student_id()
  );

CREATE POLICY "event_regs_select_tutor" ON event_registrations
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_id 
        AND e.center_id = public.current_user_center_id()
    )
  );

CREATE POLICY "event_regs_select_admin" ON event_registrations
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "event_regs_insert_student" ON event_registrations
  FOR INSERT TO authenticated WITH CHECK (
    public.current_user_role() = 'student'
    AND student_id = public.current_student_id()
  );

CREATE POLICY "event_regs_update_student" ON event_registrations
  FOR UPDATE TO authenticated USING (
    student_id = public.current_student_id()
  );

CREATE POLICY "event_regs_update_tutor" ON event_registrations
  FOR UPDATE TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_id 
        AND e.center_id = public.current_user_center_id()
    )
  );

-- ============================================
-- RLS: event_feedback
-- ============================================
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_feedback_select_own" ON event_feedback
  FOR SELECT TO authenticated USING (
    student_id = public.current_student_id()
  );

CREATE POLICY "event_feedback_select_tutor" ON event_feedback
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_id 
        AND e.center_id = public.current_user_center_id()
    )
  );

CREATE POLICY "event_feedback_select_admin" ON event_feedback
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "event_feedback_insert_student" ON event_feedback
  FOR INSERT TO authenticated WITH CHECK (
    public.current_user_role() = 'student'
    AND student_id = public.current_student_id()
  );

-- ============================================
-- RLS: resources
-- ============================================
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resources_select_published" ON resources
  FOR SELECT TO authenticated USING (
    status = 'published'
    AND (
      audience = 'all'
      OR (audience = 'students' AND public.current_user_role() = 'student')
      OR (audience = 'families' AND public.current_user_role() = 'family')
      OR (audience = 'tutors' AND public.current_user_role() = 'tutor')
    )
  );

CREATE POLICY "resources_select_tutor" ON resources
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND (center_id = public.current_user_center_id() OR center_id IS NULL)
  );

CREATE POLICY "resources_select_company" ON resources
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
  );

CREATE POLICY "resources_select_admin" ON resources
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "resources_insert_tutor" ON resources
  FOR INSERT TO authenticated WITH CHECK (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

CREATE POLICY "resources_insert_company" ON resources
  FOR INSERT TO authenticated WITH CHECK (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
    AND status = 'pending_approval'
  );

CREATE POLICY "resources_update_tutor" ON resources
  FOR UPDATE TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND (center_id = public.current_user_center_id() OR company_id IS NOT NULL)
  );

CREATE POLICY "resources_update_company" ON resources
  FOR UPDATE TO authenticated USING (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
    AND status IN ('draft', 'pending_approval')
  );

CREATE POLICY "resources_all_admin" ON resources
  FOR ALL TO authenticated USING (public.is_admin());

-- ============================================
-- RLS: resource_tags
-- ============================================
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resource_tags_select" ON resource_tags
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "resource_tags_insert_tutor" ON resource_tags
  FOR INSERT TO authenticated WITH CHECK (
    public.current_user_role() IN ('tutor', 'admin')
  );

CREATE POLICY "resource_tags_delete_tutor" ON resource_tags
  FOR DELETE TO authenticated USING (
    public.current_user_role() IN ('tutor', 'admin')
  );

-- ============================================
-- RLS: saved_resources
-- ============================================
ALTER TABLE saved_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_resources_select_own" ON saved_resources
  FOR SELECT TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "saved_resources_insert_own" ON saved_resources
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

CREATE POLICY "saved_resources_delete_own" ON saved_resources
  FOR DELETE TO authenticated USING (profile_id = auth.uid());

-- ============================================
-- RLS: threads
-- ============================================
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "threads_select_participant" ON threads
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM thread_participants tp
      WHERE tp.thread_id = id AND tp.profile_id = auth.uid()
    )
  );

CREATE POLICY "threads_select_admin" ON threads
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "threads_insert" ON threads
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- RLS: thread_participants
-- ============================================
ALTER TABLE thread_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "thread_participants_select" ON thread_participants
  FOR SELECT TO authenticated USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM thread_participants tp2
      WHERE tp2.thread_id = thread_id AND tp2.profile_id = auth.uid()
    )
  );

CREATE POLICY "thread_participants_insert" ON thread_participants
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "thread_participants_update_own" ON thread_participants
  FOR UPDATE TO authenticated USING (profile_id = auth.uid());

-- ============================================
-- RLS: messages
-- ============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_participant" ON messages
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM thread_participants tp
      WHERE tp.thread_id = thread_id AND tp.profile_id = auth.uid()
    )
  );

CREATE POLICY "messages_select_admin" ON messages
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "messages_insert_participant" ON messages
  FOR INSERT TO authenticated WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM thread_participants tp
      WHERE tp.thread_id = thread_id AND tp.profile_id = auth.uid()
    )
  );

-- ============================================
-- RLS: invitations
-- ============================================
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invitations_select_tutor" ON invitations
  FOR SELECT TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

CREATE POLICY "invitations_select_admin" ON invitations
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "invitations_insert_tutor" ON invitations
  FOR INSERT TO authenticated WITH CHECK (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
    AND created_by = auth.uid()
  );

CREATE POLICY "invitations_insert_admin" ON invitations
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "invitations_update_tutor" ON invitations
  FOR UPDATE TO authenticated USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

CREATE POLICY "invitations_all_admin" ON invitations
  FOR ALL TO authenticated USING (public.is_admin());

-- ============================================
-- RLS: formative_options (público para lectura)
-- ============================================
ALTER TABLE formative_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "formative_options_select" ON formative_options
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "formative_options_all_admin" ON formative_options
  FOR ALL TO authenticated USING (public.is_admin());

-- ============================================
-- RLS: feedback_reports
-- ============================================
ALTER TABLE feedback_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_insert_any" ON feedback_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "feedback_select_own" ON feedback_reports
  FOR SELECT TO authenticated USING (reporter_id = auth.uid());

CREATE POLICY "feedback_select_admin" ON feedback_reports
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "feedback_update_admin" ON feedback_reports
  FOR UPDATE TO authenticated USING (public.is_admin());

-- ============================================
-- RLS: error_reports
-- ============================================
ALTER TABLE error_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "error_reports_insert_any" ON error_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "error_reports_select_admin" ON error_reports
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "error_reports_update_admin" ON error_reports
  FOR UPDATE TO authenticated USING (public.is_admin());

-- ============================================
-- RLS: audit_logs (solo admin)
-- ============================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_select_admin" ON audit_logs
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "audit_logs_insert_system" ON audit_logs
  FOR INSERT TO service_role WITH CHECK (true);
