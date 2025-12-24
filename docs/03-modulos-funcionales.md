# OrientaFuturo - Módulos Funcionales

## 1. Módulo: Auth + Onboarding

### 1.1 Funcionalidades

| Funcionalidad | Descripción | Roles |
|---------------|-------------|-------|
| **Registro con invitación** | Alta mediante código/enlace del centro | Alumno, Familia |
| **Registro empresa** | Solicitud de alta con validación admin | Empresa |
| **Login email/password** | Autenticación estándar | Todos |
| **Magic link** | Login sin contraseña (opcional) | Todos |
| **Recuperación contraseña** | Flujo de reset por email | Todos |
| **Onboarding por rol** | Wizard inicial según tipo de usuario | Todos |
| **Verificación email** | Confirmación de cuenta | Todos |

### 1.2 Flujos de Onboarding

**Alumno:**
1. Introduce código de invitación del centro
2. Completa datos básicos (nombre, curso)
3. Cuestionario inicial de intereses (5 min)
4. Tour guiado de la plataforma

**Familia:**
1. Registro con email
2. Solicita vinculación con alumno(s)
3. Espera aprobación del centro
4. Tour de funcionalidades para familias

**Tutor/Orientador:**
1. Invitación directa del centro/admin
2. Configuración de grupos asignados
3. Tour de herramientas de gestión

**Empresa:**
1. Formulario de solicitud (datos empresa, sector, motivación)
2. Revisión por Super Admin
3. Aprobación y acceso al panel

---

## 2. Módulo: Perfiles y Relaciones

### 2.1 Funcionalidades

| Funcionalidad | Descripción | Roles |
|---------------|-------------|-------|
| **Perfil de usuario** | Datos personales, avatar, preferencias | Todos |
| **Perfil de alumno** | Curso, intereses, objetivos | Alumno |
| **Perfil de empresa** | Datos corporativos, sector, descripción | Empresa |
| **Vinculación familiar** | Solicitud y aprobación de tutela | Familia |
| **Gestión de grupos** | Asignación alumno-tutor | Tutor |
| **Preferencias de notificación** | Email, push, frecuencia | Todos |

### 2.2 Vinculación Familia-Alumno

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Familia   │────▶│  Solicitud  │────▶│   Centro    │
│  solicita   │     │  pendiente  │     │   aprueba   │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  Vínculo    │
                                        │   activo    │
                                        └─────────────┘
```

**Métodos de vinculación:**
- Código único generado por el centro
- Verificación por DNI/documento (con validación manual)
- Invitación directa del tutor

---

## 3. Módulo: Plan del Alumno

### 3.1 Funcionalidades

| Funcionalidad | Descripción | Roles |
|---------------|-------------|-------|
| **Crear plan** | Definir itinerario formativo | Tutor |
| **Plantillas de plan** | Planes predefinidos por perfil | Tutor |
| **Hitos del plan** | Objetivos principales con fecha | Tutor, Alumno (ver) |
| **Tareas** | Acciones concretas bajo cada hito | Tutor, Alumno |
| **Marcar completado** | Alumno marca tareas hechas | Alumno |
| **Subir evidencias** | Archivos que demuestran logro | Alumno |
| **Comentarios** | Feedback del tutor en tareas | Tutor |
| **Progreso visual** | Barra/gráfico de avance | Todos |

### 3.2 Estructura del Plan

```
PLAN DEL ALUMNO
├── Información general
│   ├── Objetivo principal (ej: "Acceder a Grado Medio de Informática")
│   ├── Fecha inicio / fin estimado
│   └── Estado: borrador | activo | completado
│
├── HITO 1: "Explorar opciones de FP"
│   ├── Fecha límite: 15/01/2025
│   ├── Estado: completado
│   └── Tareas:
│       ├── [✓] Completar test de intereses
│       ├── [✓] Leer guía de familias profesionales
│       └── [✓] Asistir a charla de FP del centro
│
├── HITO 2: "Conocer centros de FP"
│   ├── Fecha límite: 28/02/2025
│   ├── Estado: en_progreso
│   └── Tareas:
│       ├── [✓] Investigar 3 centros cercanos
│       ├── [ ] Asistir a jornada de puertas abiertas
│       └── [ ] Hablar con estudiantes actuales
│
└── HITO 3: "Preparar solicitud"
    ├── Fecha límite: 30/04/2025
    ├── Estado: pendiente
    └── Tareas:
        ├── [ ] Reunir documentación
        ├── [ ] Revisar notas necesarias
        └── [ ] Completar preinscripción
```

### 3.3 Tipos de Tareas

| Tipo | Descripción | Verificación |
|------|-------------|--------------|
| **Lectura** | Leer un recurso/guía | Auto-marcado |
| **Cuestionario** | Completar test | Automática |
| **Evento** | Asistir a charla/taller | Por inscripción |
| **Entregable** | Subir documento/evidencia | Manual tutor |
| **Reunión** | Tutoría con orientador | Manual tutor |

---

## 4. Módulo: Catálogo de Opciones Formativas

### 4.1 Funcionalidades

| Funcionalidad | Descripción | Roles |
|---------------|-------------|-------|
| **Explorador de opciones** | Navegar Bachillerato/FP/Universidad | Todos |
| **Fichas detalladas** | Info completa de cada opción | Todos |
| **Comparador** | Comparar 2-3 opciones lado a lado | Familia, Alumno |
| **Rutas alternativas** | Caminos para llegar al mismo destino | Todos |
| **Filtros inteligentes** | Por intereses, notas, ubicación | Todos |
| **Guardar favoritos** | Lista personal de opciones | Alumno, Familia |

### 4.2 Estructura del Catálogo

```
OPCIONES POST-ESO
├── BACHILLERATO
│   ├── Ciencias y Tecnología
│   │   ├── Descripción
│   │   ├── Asignaturas
│   │   ├── Salidas (universidad, FP superior)
│   │   └── Centros que lo imparten
│   ├── Humanidades y Ciencias Sociales
│   └── Artes
│
├── FORMACIÓN PROFESIONAL
│   ├── Grado Medio
│   │   ├── Por familia profesional
│   │   │   ├── Informática y Comunicaciones
│   │   │   ├── Sanidad
│   │   │   ├── Administración
│   │   │   └── ...
│   │   └── Por centro
│   └── Grado Superior
│       └── (accesible desde Bach o GM)
│
├── OTRAS OPCIONES
│   ├── FP Básica
│   ├── Escuelas de adultos
│   └── Certificados de profesionalidad
│
└── RUTAS ALTERNATIVAS
    ├── "De FP Medio a Universidad"
    ├── "Cambiar de rama en Bachillerato"
    └── "Acceso a FP Superior sin Bachillerato"
```

### 4.3 Ficha de Opción Formativa

- Nombre y código oficial
- Duración
- Requisitos de acceso
- Contenidos/módulos principales
- Salidas profesionales
- Continuidad de estudios
- Centros cercanos que lo imparten
- Nota de corte (si aplica)
- Testimonios de estudiantes (opcional)

---

## 5. Módulo: Eventos

### 5.1 Funcionalidades

| Funcionalidad | Descripción | Roles |
|---------------|-------------|-------|
| **Crear evento (centro)** | Charlas, talleres internos | Tutor |
| **Proponer evento (empresa)** | Solicitud con aprobación | Empresa |
| **Aprobar/rechazar** | Validación de propuestas | Tutor |
| **Calendario de eventos** | Vista mensual/semanal | Todos |
| **Inscripción** | Apuntarse a evento | Alumno |
| **Lista de espera** | Si hay aforo limitado | Alumno |
| **Recordatorios** | Notificaciones pre-evento | Alumno |
| **Feedback post-evento** | Valoración y comentarios | Alumno |
| **Estadísticas** | Asistencia, valoraciones | Tutor, Empresa (agregado) |

### 5.2 Tipos de Eventos

| Tipo | Organiza | Ejemplo |
|------|----------|---------|
| **Charla informativa** | Centro/Empresa | "Conoce la FP de Sanidad" |
| **Taller práctico** | Centro/Empresa | "Taller de programación básica" |
| **Visita a empresa** | Empresa | "Visita a las instalaciones de X" |
| **Jornada puertas abiertas** | Centro | "Conoce nuestro Bachillerato" |
| **Feria de orientación** | Centro | "Feria de universidades" |
| **Tutoría grupal** | Centro | "Sesión de dudas sobre selectividad" |

### 5.3 Flujo de Evento de Empresa

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Empresa   │────▶│  Propuesta  │────▶│   Tutor     │
│   crea      │     │  pendiente  │     │   revisa    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    ▼                          ▼                          ▼
             ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
             │  Aprobado   │           │  Rechazado  │           │  Cambios    │
             │  (visible)  │           │  (notifica) │           │  pedidos    │
             └─────────────┘           └─────────────┘           └─────────────┘
```

---

## 6. Módulo: Recursos y Artículos

### 6.1 Funcionalidades

| Funcionalidad | Descripción | Roles |
|---------------|-------------|-------|
| **Crear recurso** | Guías, vídeos, documentos | Tutor, Admin |
| **Proponer artículo** | Contenido de empresa | Empresa |
| **Aprobar contenido** | Validación editorial | Tutor |
| **Categorizar** | Tags por rama/tema | Tutor |
| **Buscar recursos** | Filtros y búsqueda | Todos |
| **Guardar favoritos** | Lista personal | Alumno, Familia |
| **Recomendar** | IA sugiere recursos | Sistema |
| **Estadísticas** | Visualizaciones, utilidad | Tutor, Admin |

### 6.2 Tipos de Recursos

| Tipo | Audiencia | Ejemplo |
|------|-----------|---------|
| **Guía para familias** | Familia | "Entender las opciones post-ESO" |
| **Guía para alumnos** | Alumno | "Cómo elegir tu Bachillerato" |
| **Vídeo explicativo** | Todos | "¿Qué es la FP Dual?" |
| **Infografía** | Todos | "Mapa de opciones formativas" |
| **Artículo de empresa** | Todos | "Un día en la vida de un técnico en X" |
| **FAQ** | Todos | "Preguntas frecuentes sobre selectividad" |

### 6.3 Sistema de Tags

```
TAGS DE RECURSOS
├── Por nivel educativo
│   ├── eso
│   ├── bachillerato
│   ├── fp-basica
│   ├── fp-medio
│   └── fp-superior
│
├── Por familia profesional
│   ├── informatica
│   ├── sanidad
│   ├── administracion
│   └── ...
│
├── Por audiencia
│   ├── para-familias
│   ├── para-alumnos
│   └── para-tutores
│
└── Por tema
    ├── orientacion
    ├── becas
    ├── selectividad
    └── mundo-laboral
```

---

## 7. Módulo: Mensajería

### 7.1 Funcionalidades

| Funcionalidad | Descripción | Roles |
|---------------|-------------|-------|
| **Crear conversación** | Iniciar hilo con destinatario | Todos (según permisos) |
| **Enviar mensaje** | Texto + adjuntos | Todos |
| **Notificación nuevo mensaje** | Email + push | Todos |
| **Marcar como leído** | Estado de lectura | Todos |
| **Archivar conversación** | Ocultar sin eliminar | Todos |
| **Buscar en mensajes** | Búsqueda de texto | Todos |

### 7.2 Canales de Comunicación Permitidos

| De → A | Permitido | Notas |
|--------|-----------|-------|
| Alumno → Tutor | ✅ | Canal principal |
| Alumno → Familia | ❌ | Fuera de plataforma |
| Familia → Tutor | ✅ | Sobre sus vinculados |
| Tutor → Alumno | ✅ | Seguimiento |
| Tutor → Familia | ✅ | Coordinación |
| Empresa → Centro | ✅ | Sobre propuestas |
| Centro → Empresa | ✅ | Feedback propuestas |
| Empresa → Alumno | ❌ | Prohibido |
| Empresa → Familia | ❌ | Prohibido |

### 7.3 Estructura de Conversación

```
CONVERSACIÓN
├── Participantes: [Alumno X, Tutor Y]
├── Asunto: "Dudas sobre mi plan"
├── Creada: 2025-01-15
├── Último mensaje: 2025-01-20
│
└── Mensajes:
    ├── [Alumno] 15/01 10:30 - "Hola, tengo dudas sobre..."
    ├── [Tutor] 15/01 14:15 - "Hola, te comento..."
    └── [Alumno] 20/01 09:00 - "Gracias, otra pregunta..."
```

---

## 8. Módulo: IA Recomendadora

### 8.1 Funcionalidades

| Funcionalidad | Descripción | Implementación |
|---------------|-------------|----------------|
| **Recomendar eventos** | Eventos según intereses | MVP: reglas |
| **Recomendar recursos** | Contenido relevante | MVP: reglas |
| **Sugerir rutas** | Itinerarios formativos | MVP: reglas |
| **Alertas proactivas** | "No olvides inscribirte a..." | MVP: reglas |
| **Análisis de intereses** | Procesar cuestionarios | Fase 2: LLM |
| **Chat orientador** | Asistente conversacional | Fase 2: LLM |

### 8.2 Arquitectura Modular

```typescript
// Interfaz común para motores de recomendación
interface IRecommendationEngine {
  recommendEvents(studentId: string): Promise<Event[]>;
  recommendResources(studentId: string): Promise<Resource[]>;
  suggestRoutes(studentId: string): Promise<Route[]>;
}

// Implementación MVP: basada en reglas
class RuleBasedEngine implements IRecommendationEngine {
  async recommendEvents(studentId: string): Promise<Event[]> {
    const student = await getStudent(studentId);
    const interests = student.interests; // ['informatica', 'ciencias']
    
    return await db.events
      .where('tags', 'overlaps', interests)
      .where('date', '>', new Date())
      .orderBy('date')
      .limit(5);
  }
  // ...
}

// Implementación futura: LLM
class LLMEngine implements IRecommendationEngine {
  async recommendEvents(studentId: string): Promise<Event[]> {
    const context = await buildStudentContext(studentId);
    const response = await llm.complete({
      prompt: `Dado el perfil del alumno: ${context}, 
               recomienda eventos relevantes...`
    });
    return parseEvents(response);
  }
  // ...
}
```

### 8.3 Reglas MVP (Ejemplos)

| Regla | Condición | Acción |
|-------|-----------|--------|
| R1 | Alumno en 4º ESO + interés "informática" | Recomendar eventos de FP Informática |
| R2 | Alumno sin test de intereses completado | Mostrar alerta "Completa tu test" |
| R3 | Evento próximo (< 7 días) + alumno inscrito | Enviar recordatorio |
| R4 | Alumno con plan sin actividad > 14 días | Notificar al tutor |
| R5 | Familia sin acceso > 30 días | Email de re-engagement |

---

## 9. Módulo: Super Admin Console

### 9.1 Funcionalidades

| Funcionalidad | Descripción | Prioridad |
|---------------|-------------|-----------|
| **Dashboard** | Métricas globales de la plataforma | MVP |
| **Gestión de centros** | CRUD de centros educativos | MVP |
| **Gestión de usuarios** | CRUD, roles, desactivación | MVP |
| **Aprobación empresas** | Validar solicitudes de alta | MVP |
| **Moderación** | Revisar contenido reportado | MVP |
| **Logs de auditoría** | Historial de acciones sensibles | MVP |
| **Errores y feedback** | Panel de incidencias | MVP |
| **Health checks** | Estado de servicios | MVP |
| **Modo mantenimiento** | Flag global de pausa | Fase 2 |
| **Backups/Export** | Descarga de datos | Fase 2 |
| **Impersonación** | Actuar como usuario (soporte) | Fase 2 |

### 9.2 Dashboard de Métricas

```
MÉTRICAS GLOBALES
├── Usuarios
│   ├── Total: 5,234
│   ├── Activos (7d): 2,100
│   ├── Por rol: Alumnos 3,500 | Familias 1,200 | Tutores 450 | Empresas 84
│   └── Nuevos (30d): 320
│
├── Centros
│   ├── Total: 45
│   ├── Activos: 42
│   └── Por comunidad autónoma: [mapa]
│
├── Actividad
│   ├── Planes creados (30d): 180
│   ├── Eventos realizados (30d): 25
│   ├── Mensajes enviados (30d): 1,450
│   └── Recursos consultados (30d): 8,200
│
└── Sistema
    ├── Errores (24h): 3
    ├── Feedback pendiente: 12
    └── Propuestas empresa pendientes: 8
```

### 9.3 Auditoría

Acciones que se registran:
- Login/logout de cualquier usuario
- Cambios de rol
- Aprobación/rechazo de propuestas
- Eliminación de contenido
- Exportación de datos
- Impersonación (si se implementa)
- Cambios en configuración global
