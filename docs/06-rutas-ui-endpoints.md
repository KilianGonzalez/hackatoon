# OrientaFuturo - Rutas UI y Endpoints API

## 1. Rutas de la Interfaz de Usuario

### 1.1 Rutas Públicas (Sin autenticación)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Landing | Página de inicio con info del proyecto |
| `/login` | Login | Formulario de acceso |
| `/register` | Registro | Selección de tipo de cuenta |
| `/register/student` | Registro Alumno | Con código de invitación |
| `/register/family` | Registro Familia | Datos básicos |
| `/register/company` | Registro Empresa | Solicitud de alta |
| `/forgot-password` | Recuperar contraseña | Envío de email |
| `/reset-password` | Nueva contraseña | Con token |
| `/verify-email` | Verificar email | Confirmación |
| `/guia-post-eso` | Guía pública | Información general (SEO) |

---

### 1.2 Rutas del Alumno (`/app/student/*`)

| Ruta | Página | Funcionalidades |
|------|--------|-----------------|
| `/app/student` | Dashboard | Resumen: plan, próximos eventos, tareas pendientes |
| `/app/student/plan` | Mi Plan | Vista completa del plan con hitos y tareas |
| `/app/student/plan/[itemId]` | Detalle Hito | Tareas del hito, marcar completadas, subir evidencias |
| `/app/student/events` | Eventos | Lista de eventos disponibles, filtros |
| `/app/student/events/[id]` | Detalle Evento | Info, inscripción, cancelar |
| `/app/student/events/my` | Mis Inscripciones | Eventos donde estoy inscrito |
| `/app/student/resources` | Recursos | Catálogo con búsqueda y filtros |
| `/app/student/resources/[id]` | Detalle Recurso | Contenido completo |
| `/app/student/resources/saved` | Guardados | Mis recursos favoritos |
| `/app/student/explore` | Explorar Opciones | Catálogo de opciones formativas |
| `/app/student/explore/[id]` | Detalle Opción | Ficha completa de opción formativa |
| `/app/student/explore/compare` | Comparador | Comparar 2-3 opciones |
| `/app/student/questionnaire` | Cuestionario | Test de intereses |
| `/app/student/questionnaire/results` | Resultados | Mis intereses y recomendaciones |
| `/app/student/messages` | Mensajes | Bandeja de entrada |
| `/app/student/messages/[threadId]` | Conversación | Hilo de mensajes |
| `/app/student/messages/new` | Nuevo Mensaje | Contactar con tutor |
| `/app/student/profile` | Mi Perfil | Datos personales, preferencias |
| `/app/student/notifications` | Notificaciones | Historial de notificaciones |

---

### 1.3 Rutas de Familia (`/app/family/*`)

| Ruta | Página | Funcionalidades |
|------|--------|-----------------|
| `/app/family` | Dashboard | Resumen de hijos vinculados |
| `/app/family/children` | Mis Hijos | Lista de alumnos vinculados |
| `/app/family/children/[studentId]` | Perfil Hijo | Datos y progreso del alumno |
| `/app/family/children/[studentId]/plan` | Plan del Hijo | Vista del plan (solo lectura) |
| `/app/family/children/link` | Vincular Hijo | Solicitar vinculación |
| `/app/family/guide` | Guía Post-ESO | Guía completa para familias |
| `/app/family/guide/options` | Opciones Formativas | Catálogo explicado |
| `/app/family/guide/compare` | Comparador | Comparar opciones |
| `/app/family/guide/faq` | Preguntas Frecuentes | FAQ para familias |
| `/app/family/events` | Eventos | Eventos de los hijos |
| `/app/family/resources` | Recursos | Recursos para familias |
| `/app/family/resources/[id]` | Detalle Recurso | Contenido |
| `/app/family/messages` | Mensajes | Comunicación con tutores |
| `/app/family/messages/[threadId]` | Conversación | Hilo |
| `/app/family/profile` | Mi Perfil | Datos y preferencias |

---

### 1.4 Rutas de Tutor/Orientador (`/app/tutor/*`)

| Ruta | Página | Funcionalidades |
|------|--------|-----------------|
| `/app/tutor` | Dashboard | Métricas, alertas, tareas pendientes |
| `/app/tutor/students` | Alumnos | Lista de alumnos del centro/grupo |
| `/app/tutor/students/[id]` | Perfil Alumno | Datos completos, historial |
| `/app/tutor/students/[id]/plan` | Plan Alumno | Gestión del plan |
| `/app/tutor/students/[id]/plan/edit` | Editar Plan | Crear/modificar hitos y tareas |
| `/app/tutor/plans` | Gestión Planes | Vista general de todos los planes |
| `/app/tutor/plans/templates` | Plantillas | Plantillas de planes reutilizables |
| `/app/tutor/plans/templates/new` | Nueva Plantilla | Crear plantilla |
| `/app/tutor/events` | Eventos | Gestión de eventos del centro |
| `/app/tutor/events/new` | Nuevo Evento | Crear evento |
| `/app/tutor/events/[id]` | Detalle Evento | Ver/editar evento |
| `/app/tutor/events/[id]/registrations` | Inscripciones | Lista de inscritos, asistencia |
| `/app/tutor/events/proposals` | Propuestas | Propuestas de empresas pendientes |
| `/app/tutor/events/proposals/[id]` | Revisar Propuesta | Aprobar/rechazar |
| `/app/tutor/resources` | Recursos | Gestión de recursos del centro |
| `/app/tutor/resources/new` | Nuevo Recurso | Crear recurso |
| `/app/tutor/resources/[id]/edit` | Editar Recurso | Modificar recurso |
| `/app/tutor/resources/proposals` | Artículos Pendientes | Propuestas de empresas |
| `/app/tutor/analytics` | Analíticas | Estadísticas del centro |
| `/app/tutor/analytics/participation` | Participación | Métricas de actividad |
| `/app/tutor/analytics/interests` | Intereses | Distribución de intereses |
| `/app/tutor/families` | Familias | Gestión de vínculos familiares |
| `/app/tutor/families/pending` | Vínculos Pendientes | Aprobar solicitudes |
| `/app/tutor/invitations` | Invitaciones | Generar códigos de invitación |
| `/app/tutor/messages` | Mensajes | Comunicación |
| `/app/tutor/messages/[threadId]` | Conversación | Hilo |
| `/app/tutor/profile` | Mi Perfil | Datos |

---

### 1.5 Rutas de Empresa (`/app/company/*`)

| Ruta | Página | Funcionalidades |
|------|--------|-----------------|
| `/app/company` | Dashboard | Estado de propuestas, métricas |
| `/app/company/proposals` | Mis Propuestas | Lista de propuestas |
| `/app/company/proposals/new` | Nueva Propuesta | Crear charla/taller/visita/artículo |
| `/app/company/proposals/[id]` | Detalle Propuesta | Ver estado, editar si pendiente |
| `/app/company/proposals/[id]/stats` | Estadísticas | Inscripciones agregadas, feedback |
| `/app/company/articles` | Mis Artículos | Artículos propuestos |
| `/app/company/articles/new` | Nuevo Artículo | Crear artículo |
| `/app/company/articles/[id]/edit` | Editar Artículo | Modificar borrador |
| `/app/company/messages` | Mensajes | Comunicación con centros |
| `/app/company/messages/[threadId]` | Conversación | Hilo |
| `/app/company/profile` | Perfil Empresa | Datos corporativos |
| `/app/company/profile/edit` | Editar Perfil | Modificar datos |

---

### 1.6 Rutas de Super Admin (`/admin/*`)

| Ruta | Página | Funcionalidades |
|------|--------|-----------------|
| `/admin` | Dashboard | Métricas globales, alertas |
| `/admin/centers` | Centros | CRUD de centros |
| `/admin/centers/new` | Nuevo Centro | Crear centro |
| `/admin/centers/[id]` | Detalle Centro | Ver/editar centro |
| `/admin/centers/[id]/users` | Usuarios Centro | Usuarios del centro |
| `/admin/users` | Usuarios | Gestión global de usuarios |
| `/admin/users/[id]` | Detalle Usuario | Ver/editar usuario |
| `/admin/users/[id]/impersonate` | Impersonar | Actuar como usuario (con auditoría) |
| `/admin/companies` | Empresas | Gestión de empresas |
| `/admin/companies/pending` | Pendientes | Aprobar solicitudes |
| `/admin/companies/[id]` | Detalle Empresa | Ver/editar empresa |
| `/admin/moderation` | Moderación | Contenido reportado |
| `/admin/moderation/[id]` | Revisar Reporte | Acción sobre contenido |
| `/admin/feedback` | Feedback | Feedback de usuarios |
| `/admin/feedback/[id]` | Detalle Feedback | Resolver feedback |
| `/admin/errors` | Errores | Log de errores |
| `/admin/errors/[id]` | Detalle Error | Investigar error |
| `/admin/audit` | Auditoría | Logs de auditoría |
| `/admin/system` | Sistema | Health checks, configuración |
| `/admin/system/maintenance` | Mantenimiento | Activar/desactivar modo |
| `/admin/system/backups` | Backups | Exportar datos |

---

## 2. Endpoints API / Acciones Supabase

### 2.1 Autenticación (Supabase Auth)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/v1/signup` | Registro de usuario |
| POST | `/auth/v1/token?grant_type=password` | Login |
| POST | `/auth/v1/token?grant_type=refresh_token` | Refresh token |
| POST | `/auth/v1/logout` | Logout |
| POST | `/auth/v1/recover` | Recuperar contraseña |
| PUT | `/auth/v1/user` | Actualizar usuario |

### 2.2 Perfiles y Usuarios

| Acción | Tabla/RPC | Descripción |
|--------|-----------|-------------|
| `profiles.select()` | profiles | Obtener perfil propio |
| `profiles.update()` | profiles | Actualizar perfil |
| `students.select()` | students | Obtener datos de alumno |
| `students.update()` | students | Actualizar preferencias |
| `rpc.complete_onboarding()` | function | Marcar onboarding completado |

### 2.3 Vinculación Familiar

| Acción | Tabla/RPC | Descripción |
|--------|-----------|-------------|
| `guardian_links.insert()` | guardian_links | Solicitar vinculación |
| `guardian_links.select()` | guardian_links | Ver mis vínculos |
| `rpc.approve_guardian_link()` | function | Aprobar vínculo (tutor) |
| `rpc.reject_guardian_link()` | function | Rechazar vínculo (tutor) |
| `rpc.get_linked_students()` | function | Obtener alumnos vinculados |

### 2.4 Planes

| Acción | Tabla/RPC | Descripción |
|--------|-----------|-------------|
| `plans.select()` | plans | Obtener plan |
| `plans.insert()` | plans | Crear plan (tutor) |
| `plans.update()` | plans | Actualizar plan (tutor) |
| `plan_items.select()` | plan_items | Obtener hitos |
| `plan_items.insert()` | plan_items | Crear hito (tutor) |
| `plan_items.update()` | plan_items | Actualizar hito (tutor) |
| `plan_tasks.select()` | plan_tasks | Obtener tareas |
| `plan_tasks.insert()` | plan_tasks | Crear tarea (tutor) |
| `plan_tasks.update()` | plan_tasks | Actualizar tarea |
| `rpc.complete_task()` | function | Marcar tarea completada (alumno) |
| `rpc.upload_evidence()` | function | Subir evidencia (alumno) |
| `rpc.add_tutor_feedback()` | function | Añadir feedback (tutor) |

### 2.5 Eventos

| Acción | Tabla/RPC | Descripción |
|--------|-----------|-------------|
| `events.select()` | events | Listar eventos |
| `events.insert()` | events | Crear evento |
| `events.update()` | events | Actualizar evento |
| `rpc.approve_event()` | function | Aprobar propuesta (tutor) |
| `rpc.reject_event()` | function | Rechazar propuesta (tutor) |
| `rpc.publish_event()` | function | Publicar evento (tutor) |
| `rpc.cancel_event()` | function | Cancelar evento |
| `event_registrations.insert()` | event_registrations | Inscribirse |
| `event_registrations.update()` | event_registrations | Cancelar inscripción |
| `rpc.mark_attendance()` | function | Marcar asistencia (tutor) |
| `event_feedback.insert()` | event_feedback | Enviar feedback |
| `rpc.get_event_stats()` | function | Estadísticas agregadas (empresa) |

### 2.6 Recursos

| Acción | Tabla/RPC | Descripción |
|--------|-----------|-------------|
| `resources.select()` | resources | Listar recursos |
| `resources.insert()` | resources | Crear recurso |
| `resources.update()` | resources | Actualizar recurso |
| `rpc.approve_resource()` | function | Aprobar artículo (tutor) |
| `rpc.publish_resource()` | function | Publicar recurso |
| `rpc.increment_views()` | function | Incrementar vistas |
| `saved_resources.insert()` | saved_resources | Guardar favorito |
| `saved_resources.delete()` | saved_resources | Quitar favorito |
| `resource_tags.select()` | resource_tags | Obtener tags |

### 2.7 Mensajería

| Acción | Tabla/RPC | Descripción |
|--------|-----------|-------------|
| `threads.select()` | threads | Listar conversaciones |
| `threads.insert()` | threads | Crear conversación |
| `rpc.create_thread_with_participant()` | function | Crear hilo con destinatario |
| `messages.select()` | messages | Obtener mensajes |
| `messages.insert()` | messages | Enviar mensaje |
| `rpc.mark_thread_read()` | function | Marcar como leído |
| `rpc.archive_thread()` | function | Archivar conversación |

### 2.8 Cuestionarios e IA

| Acción | Tabla/RPC | Descripción |
|--------|-----------|-------------|
| `rpc.submit_questionnaire()` | function | Enviar respuestas del test |
| `rpc.get_recommendations()` | function | Obtener recomendaciones IA |
| `rpc.get_recommended_events()` | function | Eventos recomendados |
| `rpc.get_recommended_resources()` | function | Recursos recomendados |
| `rpc.get_suggested_routes()` | function | Rutas sugeridas |

### 2.9 Empresas

| Acción | Tabla/RPC | Descripción |
|--------|-----------|-------------|
| `companies.select()` | companies | Obtener perfil empresa |
| `companies.update()` | companies | Actualizar perfil |
| `rpc.request_company_approval()` | function | Solicitar aprobación |
| `rpc.approve_company()` | function | Aprobar empresa (admin) |
| `rpc.reject_company()` | function | Rechazar empresa (admin) |

### 2.10 Invitaciones

| Acción | Tabla/RPC | Descripción |
|--------|-----------|-------------|
| `invitations.select()` | invitations | Listar invitaciones |
| `invitations.insert()` | invitations | Crear invitación |
| `rpc.generate_invitation_code()` | function | Generar código único |
| `rpc.validate_invitation()` | function | Validar código |
| `rpc.accept_invitation()` | function | Aceptar invitación |
| `rpc.revoke_invitation()` | function | Revocar invitación |

### 2.11 Admin

| Acción | Tabla/RPC | Descripción |
|--------|-----------|-------------|
| `centers.select/insert/update/delete()` | centers | CRUD centros |
| `profiles.select/update()` | profiles | Gestión usuarios |
| `rpc.change_user_role()` | function | Cambiar rol |
| `rpc.deactivate_user()` | function | Desactivar usuario |
| `rpc.impersonate_user()` | function | Impersonar (con auditoría) |
| `audit_logs.select()` | audit_logs | Ver auditoría |
| `error_reports.select/update()` | error_reports | Gestión errores |
| `feedback_reports.select/update()` | feedback_reports | Gestión feedback |
| `rpc.get_platform_stats()` | function | Métricas globales |
| `rpc.set_maintenance_mode()` | function | Modo mantenimiento |
| `rpc.export_data()` | function | Exportar datos |

### 2.12 Catálogo Formativo

| Acción | Tabla/RPC | Descripción |
|--------|-----------|-------------|
| `formative_options.select()` | formative_options | Listar opciones |
| `rpc.search_formative_options()` | function | Búsqueda con filtros |
| `rpc.compare_options()` | function | Comparar opciones |
| `rpc.get_alternative_routes()` | function | Rutas alternativas |

---

## 3. Edge Functions (Supabase)

### 3.1 Funciones Serverless

| Función | Trigger | Descripción |
|---------|---------|-------------|
| `on-user-created` | Auth webhook | Crear perfil inicial |
| `send-notification` | Invocación | Enviar email/push |
| `process-questionnaire` | Invocación | Procesar test de intereses |
| `generate-recommendations` | Cron/Invocación | Generar recomendaciones IA |
| `send-event-reminder` | Cron | Recordatorios de eventos |
| `cleanup-expired-invitations` | Cron | Limpiar invitaciones expiradas |
| `aggregate-analytics` | Cron | Calcular métricas |

### 3.2 Webhooks

| Webhook | Evento | Acción |
|---------|--------|--------|
| `auth.user.created` | Nuevo usuario | Crear perfil, enviar bienvenida |
| `auth.user.deleted` | Usuario eliminado | Cleanup de datos |

---

## 4. Realtime Subscriptions

### 4.1 Canales en Tiempo Real

| Canal | Tabla | Uso |
|-------|-------|-----|
| `messages:thread_id=X` | messages | Nuevos mensajes en conversación |
| `notifications:user_id=X` | notifications | Notificaciones del usuario |
| `event_registrations:event_id=X` | event_registrations | Actualizaciones de inscripción |
| `plans:student_id=X` | plans | Cambios en el plan |

---

## 5. Storage Buckets

| Bucket | Acceso | Contenido |
|--------|--------|-----------|
| `avatars` | Público | Fotos de perfil |
| `evidence` | Privado (RLS) | Evidencias de tareas |
| `resources` | Público/Privado | Archivos de recursos |
| `company-logos` | Público | Logos de empresas |
| `event-images` | Público | Imágenes de eventos |
