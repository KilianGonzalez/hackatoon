# OrientaFuturo - Plan de Trabajo por Sprints

## Equipo Propuesto (4 personas)

| Rol | Responsabilidades |
|-----|-------------------|
| **Tech Lead / Full-stack Senior** | Arquitectura, decisiones técnicas, code review, backend complejo |
| **Frontend Developer** | UI/UX, componentes React, páginas, responsive |
| **Backend Developer** | Supabase, RLS, funciones, migraciones, IA |
| **QA / DevOps** | Testing, CI/CD, documentación, despliegue |

---

## MVP - Fase 1 (Sprints 1-6)

### Sprint 1: Fundamentos (Semanas 1-2)

**Objetivo:** Infraestructura base y autenticación

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| Setup proyecto Next.js 14 + TypeScript + TailwindCSS | Frontend | 3 |
| Configurar Supabase (proyecto, auth, storage) | Backend | 3 |
| Crear esquema inicial de BBDD (migraciones) | Backend | 5 |
| Implementar funciones helper RLS | Backend | 3 |
| Layout base y sistema de diseño (shadcn/ui) | Frontend | 5 |
| Páginas de auth: login, registro, recuperar contraseña | Frontend | 5 |
| Integración Supabase Auth en frontend | Frontend | 3 |
| Setup CI/CD (GitHub Actions + Vercel) | QA/DevOps | 3 |
| Configurar entornos (dev, staging) | QA/DevOps | 2 |
| Documentación de setup para desarrolladores | QA/DevOps | 2 |

**Entregables:**
- Proyecto desplegado en staging
- Login/registro funcional
- BBDD con tablas core creadas
- Pipeline CI/CD operativo

---

### Sprint 2: Onboarding y Perfiles (Semanas 3-4)

**Objetivo:** Flujos de registro por rol y gestión de perfiles

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| Sistema de invitaciones (generación de códigos) | Backend | 5 |
| Registro de alumno con código de invitación | Frontend + Backend | 5 |
| Registro de familia | Frontend + Backend | 3 |
| Onboarding wizard para alumno | Frontend | 5 |
| Onboarding wizard para familia | Frontend | 3 |
| Página de perfil (ver/editar) | Frontend | 3 |
| RLS para profiles, students, invitations | Backend | 5 |
| Trigger de creación de perfil en signup | Backend | 2 |
| Seeds de datos de prueba | Backend | 3 |
| Tests de integración auth | QA/DevOps | 3 |

**Entregables:**
- Registro completo por rol (alumno, familia)
- Onboarding funcional
- Perfiles editables
- Datos de prueba para desarrollo

---

### Sprint 3: Vinculación Familiar y Centros (Semanas 5-6)

**Objetivo:** Relación familia-alumno y gestión básica de centros

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| CRUD de centros (admin) | Backend | 3 |
| Panel admin: gestión de centros | Frontend | 5 |
| Solicitud de vinculación familia-alumno | Frontend + Backend | 5 |
| Aprobación de vínculos (tutor) | Frontend + Backend | 5 |
| Vista de hijos vinculados (familia) | Frontend | 3 |
| RLS para guardian_links | Backend | 3 |
| Registro y onboarding de tutor | Frontend + Backend | 5 |
| Dashboard básico por rol (estructura) | Frontend | 5 |
| Tests de vinculación | QA/DevOps | 3 |

**Entregables:**
- Flujo completo de vinculación familiar
- Panel admin con gestión de centros
- Dashboards básicos por rol
- Rol de tutor funcional

---

### Sprint 4: Plan del Alumno (Semanas 7-8)

**Objetivo:** Sistema de planes con hitos y tareas

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| CRUD de planes (tutor) | Backend | 5 |
| CRUD de hitos (plan_items) | Backend | 3 |
| CRUD de tareas (plan_tasks) | Backend | 3 |
| Vista de plan para alumno | Frontend | 5 |
| Editor de plan para tutor | Frontend | 8 |
| Marcar tareas completadas (alumno) | Frontend + Backend | 3 |
| Subir evidencias (storage) | Frontend + Backend | 5 |
| Cálculo automático de progreso (trigger) | Backend | 3 |
| Vista de plan para familia (solo lectura) | Frontend | 3 |
| RLS para plans, plan_items, plan_tasks | Backend | 5 |
| Tests de planes | QA/DevOps | 3 |

**Entregables:**
- Tutores pueden crear y gestionar planes
- Alumnos ven su plan y completan tareas
- Familias ven progreso de sus hijos
- Sistema de evidencias funcional

---

### Sprint 5: Eventos (Semanas 9-10)

**Objetivo:** Sistema de eventos con inscripciones

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| CRUD de eventos (tutor) | Backend | 5 |
| Listado de eventos (alumno) | Frontend | 5 |
| Detalle de evento e inscripción | Frontend + Backend | 5 |
| Mis inscripciones (alumno) | Frontend | 3 |
| Gestión de inscripciones (tutor) | Frontend | 5 |
| Marcar asistencia | Frontend + Backend | 3 |
| Feedback post-evento | Frontend + Backend | 3 |
| Calendario de eventos | Frontend | 5 |
| RLS para events, event_registrations, event_feedback | Backend | 5 |
| Notificaciones de eventos (email básico) | Backend | 5 |
| Tests de eventos | QA/DevOps | 3 |

**Entregables:**
- Tutores crean eventos
- Alumnos se inscriben y dan feedback
- Sistema de asistencia
- Notificaciones básicas por email

---

### Sprint 6: Recursos y Mensajería (Semanas 11-12)

**Objetivo:** Catálogo de recursos y comunicación interna

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| CRUD de recursos (tutor) | Backend | 5 |
| Catálogo de recursos con filtros | Frontend | 5 |
| Detalle de recurso (markdown render) | Frontend | 3 |
| Guardar favoritos | Frontend + Backend | 2 |
| Sistema de tags | Backend | 3 |
| Sistema de mensajería (threads + messages) | Backend | 8 |
| Bandeja de mensajes | Frontend | 5 |
| Conversación (enviar/recibir) | Frontend | 5 |
| Realtime para mensajes | Backend | 3 |
| RLS para resources, threads, messages | Backend | 5 |
| Tests de recursos y mensajería | QA/DevOps | 3 |

**Entregables:**
- Catálogo de recursos funcional
- Mensajería entre alumno-tutor y familia-tutor
- Recursos guardados
- Comunicación en tiempo real

---

## MVP Completado - Checklist

### Funcionalidades Core

- [ ] **Auth**: Login, registro, recuperación de contraseña
- [ ] **Onboarding**: Wizard por rol (alumno, familia, tutor)
- [ ] **Invitaciones**: Códigos para registro de alumnos
- [ ] **Perfiles**: Ver y editar datos personales
- [ ] **Vinculación**: Familia solicita, tutor aprueba
- [ ] **Planes**: Tutor crea, alumno completa tareas
- [ ] **Eventos**: Crear, inscribirse, asistencia, feedback
- [ ] **Recursos**: Catálogo, búsqueda, favoritos
- [ ] **Mensajería**: Comunicación alumno-tutor, familia-tutor
- [ ] **Admin básico**: Gestión de centros y usuarios

### Por Rol - Pantallas MVP

**Alumno:**
- [ ] Dashboard con resumen
- [ ] Mi plan con tareas
- [ ] Eventos disponibles e inscripciones
- [ ] Recursos y favoritos
- [ ] Mensajes con tutor
- [ ] Perfil

**Familia:**
- [ ] Dashboard con hijos
- [ ] Plan de cada hijo (lectura)
- [ ] Solicitar vinculación
- [ ] Mensajes con tutor
- [ ] Perfil

**Tutor:**
- [ ] Dashboard con métricas básicas
- [ ] Lista de alumnos
- [ ] Gestión de planes
- [ ] Gestión de eventos
- [ ] Gestión de recursos
- [ ] Aprobar vínculos
- [ ] Mensajes
- [ ] Generar invitaciones

**Admin:**
- [ ] Dashboard global
- [ ] CRUD centros
- [ ] Gestión usuarios

---

## Fase 2 (Sprints 7-10)

### Sprint 7: Empresas y Propuestas (Semanas 13-14)

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| Registro y aprobación de empresas | Frontend + Backend | 8 |
| Dashboard de empresa | Frontend | 5 |
| Crear propuesta de evento | Frontend + Backend | 5 |
| Flujo de aprobación (tutor) | Frontend + Backend | 5 |
| Estadísticas agregadas para empresa | Backend | 5 |
| Propuesta de artículos | Frontend + Backend | 5 |
| RLS para companies, proposals | Backend | 5 |
| Tests de empresas | QA/DevOps | 3 |

---

### Sprint 8: Catálogo Formativo y Comparador (Semanas 15-16)

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| Modelo de datos de opciones formativas | Backend | 5 |
| Seed de datos de Bachillerato y FP | Backend | 5 |
| Explorador de opciones | Frontend | 8 |
| Ficha detallada de opción | Frontend | 5 |
| Comparador de opciones | Frontend | 8 |
| Rutas alternativas | Frontend + Backend | 5 |
| Guía post-ESO para familias | Frontend | 5 |

---

### Sprint 9: Cuestionarios e IA Básica (Semanas 17-18)

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| Modelo de cuestionario de intereses | Backend | 5 |
| UI de cuestionario | Frontend | 8 |
| Procesamiento de respuestas | Backend | 5 |
| Motor de reglas para recomendaciones | Backend | 8 |
| Recomendaciones de eventos | Frontend + Backend | 5 |
| Recomendaciones de recursos | Frontend + Backend | 5 |
| Sugerencias de rutas formativas | Frontend + Backend | 5 |

---

### Sprint 10: Analíticas y Notificaciones (Semanas 19-20)

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| Dashboard analítico para tutor | Frontend | 8 |
| Métricas de participación | Backend | 5 |
| Distribución de intereses | Backend + Frontend | 5 |
| Sistema de notificaciones push | Backend | 8 |
| Preferencias de notificación | Frontend + Backend | 3 |
| Recordatorios automáticos | Backend | 5 |
| Email templates mejorados | Backend | 3 |

---

## Fase 3 (Sprints 11-14)

### Sprint 11: IA Avanzada (Semanas 21-22)

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| Integración con LLM (OpenAI/Anthropic) | Backend | 8 |
| Chat orientador básico | Frontend + Backend | 8 |
| Mejora de recomendaciones con LLM | Backend | 5 |
| Análisis de texto de cuestionarios | Backend | 5 |
| A/B testing reglas vs LLM | Backend | 5 |

---

### Sprint 12: Admin Avanzado (Semanas 23-24)

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| Panel de errores y feedback | Frontend | 5 |
| Logs de auditoría | Frontend + Backend | 8 |
| Impersonación con auditoría | Backend | 8 |
| Modo mantenimiento | Backend | 3 |
| Health checks automatizados | Backend | 5 |
| Métricas de sistema | Frontend + Backend | 5 |

---

### Sprint 13: Export y Multi-tenant (Semanas 25-26)

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| Exportación de datos (CSV, JSON) | Backend | 8 |
| Backup automatizado | DevOps | 5 |
| Importación de datos | Backend | 8 |
| Multi-tenant avanzado (aislamiento) | Backend | 8 |
| Personalización por centro | Frontend + Backend | 5 |

---

### Sprint 14: Pulido y Lanzamiento (Semanas 27-28)

| Tarea | Responsable | Puntos |
|-------|-------------|--------|
| Auditoría de seguridad | Todos | 8 |
| Optimización de rendimiento | Todos | 5 |
| Accesibilidad (WCAG) | Frontend | 8 |
| Documentación de usuario | QA/DevOps | 5 |
| Pruebas de carga | QA/DevOps | 5 |
| Preparación de producción | DevOps | 5 |
| Plan de rollout | Todos | 3 |

---

## Roadmap Visual

```
Fase 1 - MVP (12 semanas)
├── Sprint 1-2: Auth + Onboarding
├── Sprint 3-4: Vínculos + Planes
└── Sprint 5-6: Eventos + Recursos + Mensajería

Fase 2 - Funcionalidades Completas (8 semanas)
├── Sprint 7: Empresas
├── Sprint 8: Catálogo Formativo
├── Sprint 9: Cuestionarios + IA básica
└── Sprint 10: Analíticas + Notificaciones

Fase 3 - Avanzado (8 semanas)
├── Sprint 11: IA Avanzada (LLM)
├── Sprint 12: Admin Avanzado
├── Sprint 13: Export + Multi-tenant
└── Sprint 14: Pulido + Lanzamiento
```

---

## Métricas de Éxito por Fase

### MVP (Fase 1)
- [ ] 3 centros piloto activos
- [ ] 100+ alumnos registrados
- [ ] 50+ planes creados
- [ ] 10+ eventos realizados
- [ ] NPS > 7 en encuesta inicial

### Fase 2
- [ ] 10 centros activos
- [ ] 5+ empresas colaboradoras
- [ ] 500+ alumnos
- [ ] 80% de alumnos con cuestionario completado
- [ ] Tasa de inscripción a eventos > 30%

### Fase 3
- [ ] 50+ centros
- [ ] 5000+ alumnos
- [ ] IA con precisión > 70% en recomendaciones
- [ ] Tiempo de respuesta < 200ms (p95)
- [ ] Disponibilidad > 99.5%

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Retrasos en RLS complejo | Media | Alto | Empezar con reglas simples, iterar |
| Adopción baja de centros | Media | Alto | Piloto con 2-3 centros comprometidos |
| Complejidad del catálogo formativo | Alta | Medio | Empezar con datos mínimos, ampliar |
| Rendimiento con muchos usuarios | Baja | Alto | Índices, caching, monitorización |
| Cambios en requisitos | Alta | Medio | Sprints cortos, feedback continuo |
| Integración IA costosa | Media | Medio | Motor de reglas como fallback |
