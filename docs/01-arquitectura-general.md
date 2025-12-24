# OrientaFuturo - Arquitectura General

## 1. Visión del Sistema

**OrientaFuturo** es una plataforma web de orientación académico-profesional personalizada para estudiantes de ESO, que coordina el seguimiento entre Centro Educativo (Tutor/Orientador), Familia y Alumno, con participación limitada de Empresas en actividades de orientación.

### 1.1 Objetivos Principales

1. **Reducir decisiones académicas mal informadas** tras la ESO
2. **Plan personalizado por alumno**: itinerario formativo + tareas/hitos medibles
3. **Recursos claros para familias**: explicación de opciones post-ESO
4. **Actividades de orientación**: charlas, visitas, talleres con empresas colaboradoras
5. **Recomendaciones IA**: sugerencias de eventos, recursos y rutas según perfil del alumno

---

## 2. Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Next.js 14 (App Router) + TypeScript + TailwindCSS         ││
│  │  - Shadcn/ui (componentes)                                  ││
│  │  - React Query (estado servidor)                            ││
│  │  - Zustand (estado cliente)                                 ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE API/SDK                           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Supabase Client SDK                                        ││
│  │  - Auth (JWT con claims de rol)                             ││
│  │  - Realtime (mensajería, notificaciones)                    ││
│  │  - Storage (archivos, evidencias)                           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CAPA DE BASE DE DATOS                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  PostgreSQL (Supabase)                                      ││
│  │  - Row Level Security (RLS) por rol                         ││
│  │  - Funciones PL/pgSQL para lógica compleja                  ││
│  │  - Triggers para auditoría                                  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CAPA DE SERVICIOS EXTERNOS                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Servicio IA  │  │ Notificaciones│  │ Storage (S3/Supabase)│  │
│  │ (modular)    │  │ (Email/Push)  │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Justificación del Stack

### 3.1 Frontend: Next.js 14 + TypeScript

| Criterio | Justificación |
|----------|---------------|
| **Rapidez de desarrollo** | App Router con Server Components reduce boilerplate |
| **SEO** | SSR/SSG nativo para páginas públicas (guías, recursos) |
| **Tipado** | TypeScript previene errores en tiempo de desarrollo |
| **Ecosistema** | Shadcn/ui + TailwindCSS = UI profesional rápidamente |
| **Integración Supabase** | SDK oficial con soporte SSR |

### 3.2 Backend: Supabase

| Criterio | Justificación |
|----------|---------------|
| **Velocidad MVP** | Auth, DB, Storage, Realtime out-of-the-box |
| **Seguridad** | RLS nativo en PostgreSQL |
| **Escalabilidad** | PostgreSQL estándar, exportable |
| **Coste inicial** | Tier gratuito generoso para MVP |
| **Edge Functions** | Para lógica serverless (IA, webhooks) |

### 3.3 Servicio IA (Modular)

```
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICIO IA - ARQUITECTURA                    │
│                                                                  │
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │  Interfaz IA    │────▶│  Motor Reglas   │  ← MVP (Fase 1)    │
│  │  (API interna)  │     │  (rule-based)   │                    │
│  └─────────────────┘     └─────────────────┘                    │
│          │                                                       │
│          │               ┌─────────────────┐                    │
│          └──────────────▶│  Motor LLM      │  ← Fase 2+         │
│                          │  (Deepseek API) │                    │
│                          └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

**Diseño modular:**
- `IRecommendationEngine` (interfaz)
- `RuleBasedEngine` (implementación MVP)
- `DeepseekEngine` (implementación Fase 2+)

**Proveedor LLM elegido:** [Deepseek](https://platform.deepseek.com/)
- API compatible con formato OpenAI
- Modelos: `deepseek-chat` (conversacional), `deepseek-coder` (código)
- Coste competitivo para uso en producción

---

## 4. Seguridad y Privacidad

### 4.1 Principios

1. **Mínimo privilegio**: cada rol solo accede a lo estrictamente necesario
2. **Privacidad por diseño**: empresas NUNCA ven datos personales de alumnos
3. **Auditoría**: todas las acciones sensibles se registran
4. **Datos sensibles**: información de menores protegida (LOPD/GDPR)

### 4.2 Autenticación

- **Método**: Email/Password + Magic Link (opcional)
- **JWT Claims**: `{ role, center_id, user_id }`
- **Refresh tokens**: rotación automática
- **MFA**: opcional para roles administrativos (Fase 2)

### 4.3 Autorización (RLS)

Todas las tablas tienen políticas RLS activas. Ver documento `04-reglas-rls.md`.

---

## 5. Despliegue

### 5.1 Entornos

| Entorno | Propósito | URL |
|---------|-----------|-----|
| **Development** | Desarrollo local | localhost:3000 |
| **Staging** | QA y demos | staging.orientafuturo.es |
| **Production** | Producción | app.orientafuturo.es |

### 5.2 CI/CD

```
GitHub Actions:
  - lint + type-check en PR
  - tests unitarios + integración
  - deploy automático a Vercel (staging en PR, prod en main)
  - migraciones Supabase vía CLI
```

---

## 6. Monitorización

- **Errores**: Sentry (frontend + Edge Functions)
- **Analytics**: Plausible (privacy-first)
- **Logs**: Supabase Logs + tabla `error_reports`
- **Health checks**: endpoint `/api/health` + cron de Super Admin
