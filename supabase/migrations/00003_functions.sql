-- ============================================
-- OrientaFuturo - Funciones de Base de Datos
-- ============================================

-- ============================================
-- FUNCIÓN: Actualizar progreso del plan
-- ============================================
CREATE OR REPLACE FUNCTION update_plan_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
  new_progress INTEGER;
  plan_id_to_update UUID;
BEGIN
  SELECT pi.plan_id INTO plan_id_to_update
  FROM plan_items pi
  WHERE pi.id = COALESCE(NEW.plan_item_id, OLD.plan_item_id);
  
  SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'completed')
  INTO total_tasks, completed_tasks
  FROM plan_tasks pt
  JOIN plan_items pi ON pt.plan_item_id = pi.id
  WHERE pi.plan_id = plan_id_to_update;
  
  IF total_tasks > 0 THEN
    new_progress := (completed_tasks * 100) / total_tasks;
  ELSE
    new_progress := 0;
  END IF;
  
  UPDATE plans SET 
    progress_percentage = new_progress,
    updated_at = now()
  WHERE id = plan_id_to_update;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_plan_progress
AFTER INSERT OR UPDATE OR DELETE ON plan_tasks
FOR EACH ROW EXECUTE FUNCTION update_plan_progress();

-- ============================================
-- FUNCIÓN: Actualizar último mensaje del hilo
-- ============================================
CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE threads SET 
    last_message_at = NEW.created_at,
    updated_at = now()
  WHERE id = NEW.thread_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_thread_last_message
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION update_thread_last_message();

-- ============================================
-- FUNCIÓN: Incrementar contador de vistas de recurso
-- ============================================
CREATE OR REPLACE FUNCTION increment_resource_views(resource_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE resources SET view_count = view_count + 1 WHERE id = resource_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Generar código de invitación único
-- ============================================
CREATE OR REPLACE FUNCTION generate_invitation_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: Validar código de invitación
-- ============================================
CREATE OR REPLACE FUNCTION validate_invitation(p_code TEXT)
RETURNS TABLE (
  is_valid BOOLEAN,
  invitation_id UUID,
  role TEXT,
  center_id UUID,
  center_name TEXT,
  error_message TEXT
) AS $$
DECLARE
  inv RECORD;
BEGIN
  SELECT i.*, c.name as center_name INTO inv
  FROM invitations i
  JOIN centers c ON i.center_id = c.id
  WHERE i.code = p_code;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::UUID, NULL::TEXT, 'Código no encontrado'::TEXT;
    RETURN;
  END IF;
  
  IF inv.status != 'pending' THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::UUID, NULL::TEXT, 'Código ya utilizado o revocado'::TEXT;
    RETURN;
  END IF;
  
  IF inv.expires_at < now() THEN
    UPDATE invitations SET status = 'expired' WHERE id = inv.id;
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::UUID, NULL::TEXT, 'Código expirado'::TEXT;
    RETURN;
  END IF;
  
  RETURN QUERY SELECT true, inv.id, inv.role, inv.center_id, inv.center_name, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Aceptar invitación
-- ============================================
CREATE OR REPLACE FUNCTION accept_invitation(p_code TEXT, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  inv RECORD;
BEGIN
  SELECT * INTO inv FROM invitations WHERE code = p_code AND status = 'pending';
  
  IF NOT FOUND OR inv.expires_at < now() THEN
    RETURN false;
  END IF;
  
  UPDATE invitations SET 
    status = 'accepted',
    accepted_at = now(),
    accepted_by = p_user_id
  WHERE id = inv.id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Aprobar vínculo familiar
-- ============================================
CREATE OR REPLACE FUNCTION approve_guardian_link(p_link_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE guardian_links SET 
    status = 'approved',
    approved_by = auth.uid(),
    approved_at = now()
  WHERE id = p_link_id
    AND status = 'pending'
    AND EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = guardian_links.student_id 
        AND s.center_id = public.current_user_center_id()
    );
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Rechazar vínculo familiar
-- ============================================
CREATE OR REPLACE FUNCTION reject_guardian_link(p_link_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE guardian_links SET 
    status = 'rejected',
    approved_by = auth.uid(),
    approved_at = now(),
    rejection_reason = p_reason
  WHERE id = p_link_id
    AND status = 'pending'
    AND EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = guardian_links.student_id 
        AND s.center_id = public.current_user_center_id()
    );
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Completar tarea (alumno)
-- ============================================
CREATE OR REPLACE FUNCTION complete_task(
  p_task_id UUID,
  p_evidence_url TEXT DEFAULT NULL,
  p_evidence_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE plan_tasks SET 
    status = 'completed',
    completed_at = now(),
    completed_by = auth.uid(),
    evidence_url = COALESCE(p_evidence_url, evidence_url),
    evidence_notes = COALESCE(p_evidence_notes, evidence_notes)
  WHERE id = p_task_id
    AND EXISTS (
      SELECT 1 FROM plan_items pi
      JOIN plans p ON pi.plan_id = p.id
      WHERE pi.id = plan_tasks.plan_item_id
        AND p.student_id = public.current_student_id()
    );
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Añadir feedback de tutor a tarea
-- ============================================
CREATE OR REPLACE FUNCTION add_tutor_feedback(p_task_id UUID, p_feedback TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE plan_tasks SET 
    tutor_feedback = p_feedback,
    tutor_feedback_at = now()
  WHERE id = p_task_id
    AND EXISTS (
      SELECT 1 FROM plan_items pi
      JOIN plans p ON pi.plan_id = p.id
      WHERE pi.id = plan_tasks.plan_item_id
        AND p.center_id = public.current_user_center_id()
    );
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Aprobar evento de empresa
-- ============================================
CREATE OR REPLACE FUNCTION approve_event(p_event_id UUID, p_notes TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE events SET 
    status = 'approved',
    approved_by = auth.uid(),
    approved_at = now(),
    approval_notes = p_notes
  WHERE id = p_event_id
    AND status = 'pending_approval'
    AND center_id = public.current_user_center_id();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Rechazar evento de empresa
-- ============================================
CREATE OR REPLACE FUNCTION reject_event(p_event_id UUID, p_notes TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE events SET 
    status = 'rejected',
    approved_by = auth.uid(),
    approved_at = now(),
    approval_notes = p_notes
  WHERE id = p_event_id
    AND status = 'pending_approval'
    AND center_id = public.current_user_center_id();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Publicar evento
-- ============================================
CREATE OR REPLACE FUNCTION publish_event(p_event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE events SET 
    status = 'published'
  WHERE id = p_event_id
    AND status IN ('draft', 'approved')
    AND center_id = public.current_user_center_id();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Inscribirse a evento
-- ============================================
CREATE OR REPLACE FUNCTION register_for_event(p_event_id UUID)
RETURNS TABLE (
  success BOOLEAN,
  registration_id UUID,
  status TEXT,
  waitlist_position INTEGER,
  error_message TEXT
) AS $$
DECLARE
  v_event RECORD;
  v_student_id UUID;
  v_current_count INTEGER;
  v_registration_status TEXT;
  v_waitlist_pos INTEGER;
  v_reg_id UUID;
BEGIN
  v_student_id := public.current_student_id();
  
  IF v_student_id IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::INTEGER, 'No eres un alumno'::TEXT;
    RETURN;
  END IF;
  
  SELECT * INTO v_event FROM events WHERE id = p_event_id AND status = 'published';
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::INTEGER, 'Evento no encontrado o no disponible'::TEXT;
    RETURN;
  END IF;
  
  IF v_event.registration_deadline IS NOT NULL AND v_event.registration_deadline < now() THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::INTEGER, 'Plazo de inscripción cerrado'::TEXT;
    RETURN;
  END IF;
  
  IF EXISTS (SELECT 1 FROM event_registrations WHERE event_id = p_event_id AND student_id = v_student_id) THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::INTEGER, 'Ya estás inscrito en este evento'::TEXT;
    RETURN;
  END IF;
  
  SELECT COUNT(*) INTO v_current_count 
  FROM event_registrations 
  WHERE event_id = p_event_id AND status = 'registered';
  
  IF v_event.max_attendees IS NOT NULL AND v_current_count >= v_event.max_attendees THEN
    SELECT COALESCE(MAX(waitlist_position), 0) + 1 INTO v_waitlist_pos
    FROM event_registrations 
    WHERE event_id = p_event_id AND status = 'waitlist';
    
    v_registration_status := 'waitlist';
  ELSE
    v_registration_status := 'registered';
    v_waitlist_pos := NULL;
  END IF;
  
  INSERT INTO event_registrations (event_id, student_id, status, waitlist_position)
  VALUES (p_event_id, v_student_id, v_registration_status, v_waitlist_pos)
  RETURNING id INTO v_reg_id;
  
  RETURN QUERY SELECT true, v_reg_id, v_registration_status, v_waitlist_pos, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Cancelar inscripción a evento
-- ============================================
CREATE OR REPLACE FUNCTION cancel_event_registration(p_event_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_student_id UUID;
BEGIN
  v_student_id := public.current_student_id();
  
  UPDATE event_registrations SET 
    status = 'cancelled',
    cancelled_at = now()
  WHERE event_id = p_event_id 
    AND student_id = v_student_id
    AND status IN ('registered', 'waitlist');
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Marcar asistencia
-- ============================================
CREATE OR REPLACE FUNCTION mark_attendance(p_registration_id UUID, p_attended BOOLEAN)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE event_registrations SET 
    attended = p_attended,
    status = CASE WHEN p_attended THEN 'attended' ELSE 'no_show' END,
    attended_marked_by = auth.uid(),
    attended_marked_at = now()
  WHERE id = p_registration_id
    AND EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_registrations.event_id 
        AND e.center_id = public.current_user_center_id()
    );
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Estadísticas de evento para empresa (agregadas)
-- ============================================
CREATE OR REPLACE FUNCTION get_event_stats_for_company(p_event_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  v_company_id UUID;
BEGIN
  SELECT company_id INTO v_company_id FROM events WHERE id = p_event_id;
  
  IF v_company_id != public.current_company_id() THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  
  SELECT json_build_object(
    'total_registrations', COUNT(*) FILTER (WHERE er.status = 'registered'),
    'waitlist_count', COUNT(*) FILTER (WHERE er.status = 'waitlist'),
    'cancelled_count', COUNT(*) FILTER (WHERE er.status = 'cancelled'),
    'attended_count', COUNT(*) FILTER (WHERE er.attended = true),
    'by_grade', (
      SELECT json_object_agg(grade, cnt)
      FROM (
        SELECT s.current_grade as grade, COUNT(*) as cnt
        FROM event_registrations er2
        JOIN students s ON er2.student_id = s.id
        WHERE er2.event_id = p_event_id AND er2.status = 'registered'
        GROUP BY s.current_grade
      ) grade_counts
    ),
    'average_rating', (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM event_feedback ef
      WHERE ef.event_id = p_event_id
    ),
    'feedback_count', (
      SELECT COUNT(*)
      FROM event_feedback ef
      WHERE ef.event_id = p_event_id
    )
  ) INTO result
  FROM event_registrations er
  WHERE er.event_id = p_event_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Crear hilo de mensajería con participante
-- ============================================
CREATE OR REPLACE FUNCTION create_thread_with_participant(
  p_recipient_id UUID,
  p_subject TEXT DEFAULT NULL,
  p_initial_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_thread_id UUID;
BEGIN
  INSERT INTO threads (subject) VALUES (p_subject) RETURNING id INTO v_thread_id;
  
  INSERT INTO thread_participants (thread_id, profile_id) VALUES (v_thread_id, auth.uid());
  INSERT INTO thread_participants (thread_id, profile_id) VALUES (v_thread_id, p_recipient_id);
  
  IF p_initial_message IS NOT NULL THEN
    INSERT INTO messages (thread_id, sender_id, content) 
    VALUES (v_thread_id, auth.uid(), p_initial_message);
  END IF;
  
  RETURN v_thread_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Marcar hilo como leído
-- ============================================
CREATE OR REPLACE FUNCTION mark_thread_read(p_thread_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE thread_participants SET 
    last_read_at = now()
  WHERE thread_id = p_thread_id AND profile_id = auth.uid();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Obtener recomendaciones de eventos (IA básica - reglas)
-- ============================================
CREATE OR REPLACE FUNCTION get_recommended_events(p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
  event_id UUID,
  title TEXT,
  event_type TEXT,
  start_datetime TIMESTAMPTZ,
  relevance_score INTEGER
) AS $$
DECLARE
  v_student RECORD;
BEGIN
  SELECT * INTO v_student FROM students WHERE profile_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.event_type,
    e.start_datetime,
    (
      CASE WHEN e.target_grades && ARRAY[v_student.current_grade] THEN 30 ELSE 0 END +
      CASE WHEN e.target_interests && v_student.interests THEN 50 ELSE 0 END +
      CASE WHEN e.start_datetime < now() + interval '7 days' THEN 20 ELSE 0 END
    )::INTEGER as relevance_score
  FROM events e
  WHERE e.status = 'published'
    AND e.start_datetime > now()
    AND e.center_id = v_student.center_id
    AND NOT EXISTS (
      SELECT 1 FROM event_registrations er 
      WHERE er.event_id = e.id AND er.student_id = v_student.id
    )
  ORDER BY relevance_score DESC, e.start_datetime ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Obtener recomendaciones de recursos (IA básica - reglas)
-- ============================================
CREATE OR REPLACE FUNCTION get_recommended_resources(p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
  resource_id UUID,
  title TEXT,
  resource_type TEXT,
  relevance_score INTEGER
) AS $$
DECLARE
  v_student RECORD;
BEGIN
  SELECT * INTO v_student FROM students WHERE profile_id = auth.uid();
  
  IF NOT FOUND THEN
    SELECT * INTO v_student FROM profiles WHERE id = auth.uid();
    
    RETURN QUERY
    SELECT 
      r.id,
      r.title,
      r.resource_type,
      10::INTEGER as relevance_score
    FROM resources r
    WHERE r.status = 'published'
      AND (r.audience = 'all' OR r.audience = 'families')
    ORDER BY r.created_at DESC
    LIMIT p_limit;
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.resource_type,
    (
      CASE WHEN EXISTS (
        SELECT 1 FROM resource_tags rt 
        WHERE rt.resource_id = r.id AND rt.tag = ANY(v_student.interests)
      ) THEN 50 ELSE 0 END +
      CASE WHEN r.audience IN ('all', 'students') THEN 20 ELSE 0 END +
      CASE WHEN r.created_at > now() - interval '30 days' THEN 10 ELSE 0 END
    )::INTEGER as relevance_score
  FROM resources r
  WHERE r.status = 'published'
    AND (r.audience = 'all' OR r.audience = 'students')
    AND NOT EXISTS (
      SELECT 1 FROM saved_resources sr 
      WHERE sr.resource_id = r.id AND sr.profile_id = auth.uid()
    )
  ORDER BY relevance_score DESC, r.view_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Obtener métricas de plataforma (admin)
-- ============================================
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  
  SELECT json_build_object(
    'users', json_build_object(
      'total', (SELECT COUNT(*) FROM profiles),
      'active_7d', (SELECT COUNT(*) FROM profiles WHERE last_login_at > now() - interval '7 days'),
      'by_role', (
        SELECT json_object_agg(role, cnt)
        FROM (SELECT role, COUNT(*) as cnt FROM profiles GROUP BY role) r
      ),
      'new_30d', (SELECT COUNT(*) FROM profiles WHERE created_at > now() - interval '30 days')
    ),
    'centers', json_build_object(
      'total', (SELECT COUNT(*) FROM centers),
      'active', (SELECT COUNT(*) FROM centers WHERE is_active = true)
    ),
    'companies', json_build_object(
      'total', (SELECT COUNT(*) FROM companies),
      'approved', (SELECT COUNT(*) FROM companies WHERE status = 'approved'),
      'pending', (SELECT COUNT(*) FROM companies WHERE status = 'pending')
    ),
    'activity', json_build_object(
      'plans_30d', (SELECT COUNT(*) FROM plans WHERE created_at > now() - interval '30 days'),
      'events_30d', (SELECT COUNT(*) FROM events WHERE created_at > now() - interval '30 days'),
      'messages_30d', (SELECT COUNT(*) FROM messages WHERE created_at > now() - interval '30 days')
    ),
    'system', json_build_object(
      'errors_24h', (SELECT COUNT(*) FROM error_reports WHERE created_at > now() - interval '24 hours'),
      'feedback_pending', (SELECT COUNT(*) FROM feedback_reports WHERE status = 'new')
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: Registrar log de auditoría
-- ============================================
CREATE OR REPLACE FUNCTION log_audit(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_user_role TEXT;
BEGIN
  SELECT role INTO v_user_role FROM profiles WHERE id = auth.uid();
  
  INSERT INTO audit_logs (user_id, user_role, action, entity_type, entity_id, old_values, new_values, metadata)
  VALUES (auth.uid(), v_user_role, p_action, p_entity_type, p_entity_id, p_old_values, p_new_values, p_metadata)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
