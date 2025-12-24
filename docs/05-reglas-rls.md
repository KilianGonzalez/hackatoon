# OrientaFuturo - Reglas de Acceso (RLS)

## 1. Principios Generales

1. **RLS siempre activo**: Todas las tablas tienen `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
2. **Denegación por defecto**: Sin política = sin acceso
3. **Roles en JWT**: El rol se extrae de `auth.jwt() -> 'role'` o de la tabla `profiles`
4. **Funciones helper**: Usamos funciones SQL para validaciones comunes

---

## 2. Funciones Helper para RLS

```sql
-- ============================================
-- FUNCIONES DE AUTENTICACIÓN Y AUTORIZACIÓN
-- ============================================

-- Obtener el ID del usuario actual
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::UUID
$$ LANGUAGE SQL STABLE;

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
```

---

## 3. Políticas RLS por Tabla

### 3.1 Tabla: `profiles`

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: Usuario ve su propio perfil
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid());

-- SELECT: Tutor ve perfiles de su centro
CREATE POLICY "profiles_select_tutor_center" ON profiles
  FOR SELECT USING (
    public.current_user_role() = 'tutor' 
    AND center_id = public.current_user_center_id()
  );

-- SELECT: Admin ve todos
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (public.is_admin());

-- UPDATE: Usuario actualiza su propio perfil (campos limitados)
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid()) -- No puede cambiar su rol
  );

-- UPDATE: Admin puede actualizar cualquier perfil
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE USING (public.is_admin());

-- INSERT: Solo sistema (via trigger en auth.users)
-- DELETE: Solo admin
CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE USING (public.is_admin());
```

**Resumen en lenguaje natural:**
- ✅ Usuario ve su propio perfil
- ✅ Tutor ve perfiles de alumnos/familias de su centro
- ✅ Admin ve todos los perfiles
- ✅ Usuario edita su perfil (excepto rol)
- ❌ Usuario no puede cambiar su rol
- ❌ Usuario no ve perfiles de otros centros

---

### 3.2 Tabla: `students`

```sql
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- SELECT: Alumno ve sus propios datos
CREATE POLICY "students_select_own" ON students
  FOR SELECT USING (profile_id = auth.uid());

-- SELECT: Familia ve alumnos vinculados
CREATE POLICY "students_select_guardian" ON students
  FOR SELECT USING (
    public.current_user_role() = 'family'
    AND public.is_guardian_of_student(id)
  );

-- SELECT: Tutor ve alumnos de su centro
CREATE POLICY "students_select_tutor" ON students
  FOR SELECT USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

-- SELECT: Admin ve todos
CREATE POLICY "students_select_admin" ON students
  FOR SELECT USING (public.is_admin());

-- UPDATE: Alumno actualiza sus preferencias
CREATE POLICY "students_update_own" ON students
  FOR UPDATE USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- UPDATE: Tutor actualiza alumnos de su centro
CREATE POLICY "students_update_tutor" ON students
  FOR UPDATE USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

-- UPDATE: Admin
CREATE POLICY "students_update_admin" ON students
  FOR UPDATE USING (public.is_admin());
```

**Resumen:**
- ✅ Alumno ve y edita sus datos
- ✅ Familia ve datos de alumnos vinculados (solo lectura)
- ✅ Tutor ve y edita alumnos de su centro
- ❌ Empresa NO puede ver datos de alumnos

---

### 3.3 Tabla: `guardian_links`

```sql
ALTER TABLE guardian_links ENABLE ROW LEVEL SECURITY;

-- SELECT: Familia ve sus vínculos
CREATE POLICY "guardian_links_select_guardian" ON guardian_links
  FOR SELECT USING (guardian_id = auth.uid());

-- SELECT: Tutor ve vínculos de su centro
CREATE POLICY "guardian_links_select_tutor" ON guardian_links
  FOR SELECT USING (
    public.current_user_role() = 'tutor'
    AND EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = student_id 
        AND s.center_id = public.current_user_center_id()
    )
  );

-- SELECT: Admin
CREATE POLICY "guardian_links_select_admin" ON guardian_links
  FOR SELECT USING (public.is_admin());

-- INSERT: Familia puede solicitar vínculo
CREATE POLICY "guardian_links_insert_guardian" ON guardian_links
  FOR INSERT WITH CHECK (
    public.current_user_role() = 'family'
    AND guardian_id = auth.uid()
    AND status = 'pending'
  );

-- UPDATE: Tutor aprueba/rechaza vínculos de su centro
CREATE POLICY "guardian_links_update_tutor" ON guardian_links
  FOR UPDATE USING (
    public.current_user_role() = 'tutor'
    AND EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = student_id 
        AND s.center_id = public.current_user_center_id()
    )
  );

-- UPDATE: Admin
CREATE POLICY "guardian_links_update_admin" ON guardian_links
  FOR UPDATE USING (public.is_admin());
```

**Resumen:**
- ✅ Familia ve sus solicitudes de vínculo
- ✅ Familia crea solicitudes (estado pendiente)
- ✅ Tutor aprueba/rechaza vínculos de alumnos de su centro
- ❌ Familia no puede auto-aprobar vínculos

---

### 3.4 Tabla: `plans`

```sql
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- SELECT: Alumno ve su plan
CREATE POLICY "plans_select_student" ON plans
  FOR SELECT USING (
    student_id = public.current_student_id()
  );

-- SELECT: Familia ve planes de alumnos vinculados
CREATE POLICY "plans_select_guardian" ON plans
  FOR SELECT USING (
    public.current_user_role() = 'family'
    AND public.is_guardian_of_student(student_id)
  );

-- SELECT: Tutor ve planes de su centro
CREATE POLICY "plans_select_tutor" ON plans
  FOR SELECT USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

-- SELECT: Admin
CREATE POLICY "plans_select_admin" ON plans
  FOR SELECT USING (public.is_admin());

-- INSERT: Tutor crea planes para alumnos de su centro
CREATE POLICY "plans_insert_tutor" ON plans
  FOR INSERT WITH CHECK (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
    AND created_by = auth.uid()
  );

-- UPDATE: Tutor edita planes de su centro
CREATE POLICY "plans_update_tutor" ON plans
  FOR UPDATE USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

-- UPDATE: Admin
CREATE POLICY "plans_update_admin" ON plans
  FOR UPDATE USING (public.is_admin());

-- DELETE: Solo admin (archivar en lugar de eliminar)
CREATE POLICY "plans_delete_admin" ON plans
  FOR DELETE USING (public.is_admin());
```

**Resumen:**
- ✅ Alumno ve su propio plan
- ✅ Familia ve planes de hijos vinculados
- ✅ Tutor crea y edita planes de su centro
- ❌ Alumno no puede editar el plan (solo marcar tareas)
- ❌ Familia no puede editar planes

---

### 3.5 Tabla: `plan_items` y `plan_tasks`

```sql
-- PLAN_ITEMS
ALTER TABLE plan_items ENABLE ROW LEVEL SECURITY;

-- SELECT: Heredado del plan (si puede ver el plan, ve los items)
CREATE POLICY "plan_items_select" ON plan_items
  FOR SELECT USING (
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

-- INSERT/UPDATE/DELETE: Solo tutor del centro o admin
CREATE POLICY "plan_items_modify_tutor" ON plan_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM plans p WHERE p.id = plan_id
      AND (
        (public.current_user_role() = 'tutor' AND p.center_id = public.current_user_center_id())
        OR public.is_admin()
      )
    )
  );

-- PLAN_TASKS
ALTER TABLE plan_tasks ENABLE ROW LEVEL SECURITY;

-- SELECT: Similar a plan_items
CREATE POLICY "plan_tasks_select" ON plan_tasks
  FOR SELECT USING (
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

-- UPDATE: Alumno puede marcar sus tareas como completadas
CREATE POLICY "plan_tasks_update_student" ON plan_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM plan_items pi
      JOIN plans p ON pi.plan_id = p.id
      WHERE pi.id = plan_item_id
      AND p.student_id = public.current_student_id()
    )
  )
  WITH CHECK (
    -- Solo puede cambiar status, completed_at, evidence_url, evidence_notes
    -- La validación de campos se hace en la aplicación o con triggers
    TRUE
  );

-- INSERT/UPDATE/DELETE: Tutor
CREATE POLICY "plan_tasks_modify_tutor" ON plan_tasks
  FOR ALL USING (
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
```

---

### 3.6 Tabla: `events`

```sql
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- SELECT: Eventos publicados visibles para alumnos del centro
CREATE POLICY "events_select_student" ON events
  FOR SELECT USING (
    status = 'published'
    AND (
      center_id = (SELECT center_id FROM students WHERE profile_id = auth.uid())
      OR center_id IS NULL -- Eventos de empresa aprobados para todos
    )
  );

-- SELECT: Familia ve eventos donde sus hijos pueden participar
CREATE POLICY "events_select_guardian" ON events
  FOR SELECT USING (
    public.current_user_role() = 'family'
    AND status = 'published'
    AND EXISTS (
      SELECT 1 FROM guardian_links gl
      JOIN students s ON gl.student_id = s.id
      WHERE gl.guardian_id = auth.uid()
        AND gl.status = 'approved'
        AND s.center_id = events.center_id
    )
  );

-- SELECT: Tutor ve todos los eventos de su centro (incluidos pendientes)
CREATE POLICY "events_select_tutor" ON events
  FOR SELECT USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

-- SELECT: Empresa ve sus propios eventos
CREATE POLICY "events_select_company" ON events
  FOR SELECT USING (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
  );

-- SELECT: Admin
CREATE POLICY "events_select_admin" ON events
  FOR SELECT USING (public.is_admin());

-- INSERT: Tutor crea eventos de su centro
CREATE POLICY "events_insert_tutor" ON events
  FOR INSERT WITH CHECK (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
    AND created_by = auth.uid()
  );

-- INSERT: Empresa crea propuestas (estado pendiente)
CREATE POLICY "events_insert_company" ON events
  FOR INSERT WITH CHECK (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
    AND status = 'pending_approval'
    AND created_by = auth.uid()
  );

-- UPDATE: Tutor edita eventos de su centro y aprueba propuestas
CREATE POLICY "events_update_tutor" ON events
  FOR UPDATE USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

-- UPDATE: Empresa edita sus propuestas pendientes
CREATE POLICY "events_update_company" ON events
  FOR UPDATE USING (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
    AND status IN ('pending_approval', 'draft')
  );

-- UPDATE/DELETE: Admin
CREATE POLICY "events_admin" ON events
  FOR ALL USING (public.is_admin());
```

**Resumen:**
- ✅ Alumno ve eventos publicados de su centro
- ✅ Empresa crea propuestas (estado pendiente)
- ✅ Tutor aprueba/rechaza propuestas
- ❌ Empresa no puede publicar directamente

---

### 3.7 Tabla: `event_registrations`

```sql
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- SELECT: Alumno ve sus inscripciones
CREATE POLICY "event_regs_select_student" ON event_registrations
  FOR SELECT USING (
    student_id = public.current_student_id()
  );

-- SELECT: Tutor ve inscripciones de eventos de su centro
CREATE POLICY "event_regs_select_tutor" ON event_registrations
  FOR SELECT USING (
    public.current_user_role() = 'tutor'
    AND EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_id 
        AND e.center_id = public.current_user_center_id()
    )
  );

-- SELECT: Empresa ve SOLO conteo agregado (via función, no RLS directo)
-- NO tiene acceso directo a esta tabla

-- SELECT: Admin
CREATE POLICY "event_regs_select_admin" ON event_registrations
  FOR SELECT USING (public.is_admin());

-- INSERT: Alumno se inscribe
CREATE POLICY "event_regs_insert_student" ON event_registrations
  FOR INSERT WITH CHECK (
    public.current_user_role() = 'student'
    AND student_id = public.current_student_id()
  );

-- UPDATE: Alumno cancela su inscripción
CREATE POLICY "event_regs_update_student" ON event_registrations
  FOR UPDATE USING (
    student_id = public.current_student_id()
  )
  WITH CHECK (
    student_id = public.current_student_id()
    AND status IN ('cancelled') -- Solo puede cancelar
  );

-- UPDATE: Tutor marca asistencia
CREATE POLICY "event_regs_update_tutor" ON event_registrations
  FOR UPDATE USING (
    public.current_user_role() = 'tutor'
    AND EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_id 
        AND e.center_id = public.current_user_center_id()
    )
  );
```

**Resumen:**
- ✅ Alumno ve y gestiona sus inscripciones
- ✅ Tutor ve inscripciones y marca asistencia
- ❌ **Empresa NO ve lista de inscritos** (solo agregados via función)

---

### 3.8 Función para Empresa: Estadísticas Agregadas

```sql
-- Función que devuelve estadísticas SIN datos personales
CREATE OR REPLACE FUNCTION get_event_stats_for_company(p_event_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  v_company_id UUID;
BEGIN
  -- Verificar que el evento pertenece a la empresa actual
  SELECT company_id INTO v_company_id FROM events WHERE id = p_event_id;
  
  IF v_company_id != public.current_company_id() THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  
  SELECT json_build_object(
    'total_registrations', COUNT(*) FILTER (WHERE status = 'registered'),
    'waitlist_count', COUNT(*) FILTER (WHERE status = 'waitlist'),
    'cancelled_count', COUNT(*) FILTER (WHERE status = 'cancelled'),
    'attended_count', COUNT(*) FILTER (WHERE attended = true),
    'by_grade', (
      SELECT json_object_agg(s.current_grade, cnt)
      FROM (
        SELECT s.current_grade, COUNT(*) as cnt
        FROM event_registrations er
        JOIN students s ON er.student_id = s.id
        WHERE er.event_id = p_event_id AND er.status = 'registered'
        GROUP BY s.current_grade
      ) sub
    )
  ) INTO result
  FROM event_registrations
  WHERE event_id = p_event_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 3.9 Tabla: `companies`

```sql
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- SELECT: Empresa ve su propio perfil
CREATE POLICY "companies_select_own" ON companies
  FOR SELECT USING (profile_id = auth.uid());

-- SELECT: Tutor ve empresas aprobadas (para ver propuestas)
CREATE POLICY "companies_select_tutor" ON companies
  FOR SELECT USING (
    public.current_user_role() = 'tutor'
    AND status = 'approved'
  );

-- SELECT: Admin
CREATE POLICY "companies_select_admin" ON companies
  FOR SELECT USING (public.is_admin());

-- UPDATE: Empresa edita su perfil
CREATE POLICY "companies_update_own" ON companies
  FOR UPDATE USING (profile_id = auth.uid())
  WITH CHECK (
    profile_id = auth.uid()
    AND status = (SELECT status FROM companies WHERE profile_id = auth.uid()) -- No puede cambiar status
  );

-- UPDATE: Admin aprueba/rechaza
CREATE POLICY "companies_update_admin" ON companies
  FOR UPDATE USING (public.is_admin());
```

---

### 3.10 Tabla: `resources`

```sql
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- SELECT: Recursos publicados visibles para todos los autenticados
CREATE POLICY "resources_select_published" ON resources
  FOR SELECT USING (
    status = 'published'
    AND (
      audience = 'all'
      OR (audience = 'students' AND public.current_user_role() = 'student')
      OR (audience = 'families' AND public.current_user_role() = 'family')
      OR (audience = 'tutors' AND public.current_user_role() = 'tutor')
    )
  );

-- SELECT: Tutor ve recursos de su centro (todos los estados)
CREATE POLICY "resources_select_tutor" ON resources
  FOR SELECT USING (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

-- SELECT: Empresa ve sus recursos
CREATE POLICY "resources_select_company" ON resources
  FOR SELECT USING (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
  );

-- SELECT: Admin
CREATE POLICY "resources_select_admin" ON resources
  FOR SELECT USING (public.is_admin());

-- INSERT: Tutor crea recursos de su centro
CREATE POLICY "resources_insert_tutor" ON resources
  FOR INSERT WITH CHECK (
    public.current_user_role() = 'tutor'
    AND center_id = public.current_user_center_id()
  );

-- INSERT: Empresa crea propuestas de artículos
CREATE POLICY "resources_insert_company" ON resources
  FOR INSERT WITH CHECK (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
    AND status = 'pending_approval'
  );

-- UPDATE: Tutor edita y aprueba
CREATE POLICY "resources_update_tutor" ON resources
  FOR UPDATE USING (
    public.current_user_role() = 'tutor'
    AND (
      center_id = public.current_user_center_id()
      OR company_id IS NOT NULL -- Puede aprobar artículos de empresa
    )
  );

-- UPDATE: Empresa edita sus pendientes
CREATE POLICY "resources_update_company" ON resources
  FOR UPDATE USING (
    public.current_user_role() = 'company'
    AND company_id = public.current_company_id()
    AND status IN ('draft', 'pending_approval')
  );
```

---

### 3.11 Tabla: `messages` y `threads`

```sql
-- THREADS
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

-- SELECT: Participante ve sus hilos
CREATE POLICY "threads_select_participant" ON threads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM thread_participants tp
      WHERE tp.thread_id = id AND tp.profile_id = auth.uid()
    )
  );

-- SELECT: Admin
CREATE POLICY "threads_select_admin" ON threads
  FOR SELECT USING (public.is_admin());

-- INSERT: Usuarios autenticados crean hilos
CREATE POLICY "threads_insert" ON threads
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- THREAD_PARTICIPANTS
ALTER TABLE thread_participants ENABLE ROW LEVEL SECURITY;

-- Políticas similares...

-- MESSAGES
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- SELECT: Participante del hilo ve mensajes
CREATE POLICY "messages_select_participant" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM thread_participants tp
      WHERE tp.thread_id = thread_id AND tp.profile_id = auth.uid()
    )
  );

-- INSERT: Participante puede enviar mensajes
CREATE POLICY "messages_insert_participant" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM thread_participants tp
      WHERE tp.thread_id = thread_id AND tp.profile_id = auth.uid()
    )
  );
```

**Validación adicional de canales permitidos** (en aplicación o trigger):
- Alumno ↔ Tutor: ✅
- Familia ↔ Tutor: ✅
- Empresa ↔ Centro: ✅
- Empresa ↔ Alumno: ❌
- Empresa ↔ Familia: ❌

---

### 3.12 Tablas de Admin: `audit_logs`, `error_reports`, `feedback_reports`

```sql
-- AUDIT_LOGS: Solo admin puede leer
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_admin_only" ON audit_logs
  FOR SELECT USING (public.is_admin());

-- INSERT via trigger (SECURITY DEFINER), no directo
CREATE POLICY "audit_logs_insert_system" ON audit_logs
  FOR INSERT WITH CHECK (FALSE); -- Solo via funciones del sistema

-- ERROR_REPORTS
ALTER TABLE error_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "error_reports_insert_any" ON error_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "error_reports_select_admin" ON error_reports
  FOR SELECT USING (public.is_admin());

-- FEEDBACK_REPORTS
ALTER TABLE feedback_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_insert_any" ON feedback_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "feedback_select_own" ON feedback_reports
  FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "feedback_select_admin" ON feedback_reports
  FOR SELECT USING (public.is_admin());
```

---

## 4. Resumen de Reglas por Rol

### Alumno
| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Solo propio | - | Solo propio | - |
| students | Solo propio | - | Solo propio | - |
| plans | Solo propio | - | - | - |
| plan_tasks | Solo propias | - | Marcar completadas | - |
| events | Publicados de su centro | - | - | - |
| event_registrations | Solo propias | Inscribirse | Cancelar | - |
| resources | Publicados | - | - | - |
| messages | De sus hilos | En sus hilos | - | - |

### Familia
| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Solo propio | - | Solo propio | - |
| students | Vinculados | - | - | - |
| guardian_links | Propios | Solicitar | - | - |
| plans | De vinculados | - | - | - |
| events | De centros de vinculados | - | - | - |
| resources | Publicados para familias | - | - | - |
| messages | De sus hilos | En sus hilos | - | - |

### Tutor/Orientador
| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | De su centro | - | - | - |
| students | De su centro | - | Editar | - |
| plans | De su centro | Crear | Editar | - |
| events | De su centro | Crear | Editar/Aprobar | - |
| resources | De su centro | Crear | Editar/Aprobar | Archivar |
| messages | De sus hilos | En sus hilos | - | - |
| guardian_links | De su centro | - | Aprobar | - |

### Empresa
| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| companies | Solo propia | - | Solo propia | - |
| events | Solo propios | Proponer | Editar pendientes | - |
| resources | Solo propios | Proponer | Editar pendientes | - |
| event_registrations | ❌ (solo agregados) | - | - | - |
| students | ❌ | - | - | - |

### Super Admin
| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| * | ✅ Todo | ✅ Todo | ✅ Todo | ✅ Todo |
| audit_logs | ✅ | Via sistema | - | - |
