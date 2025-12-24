# OrientaFuturo

Plataforma web de orientación académico-profesional personalizada para estudiantes de ESO/Bachillerato/FP.

## 📋 Descripción

OrientaFuturo es una plataforma que coordina el seguimiento entre Centro Educativo (Tutor/Orientador), Familia y Alumno, con participación limitada de Empresas en actividades de orientación (charlas, talleres, visitas).

### Objetivos principales

- **Reducir decisiones académicas mal informadas** tras la ESO
- **Plan personalizado por alumno**: itinerario formativo + tareas/hitos medibles
- **Recursos claros para familias**: explicación de opciones post-ESO
- **Actividades de orientación**: charlas, visitas, talleres con empresas colaboradoras
- **Recomendaciones IA**: sugerencias de eventos, recursos y rutas según perfil del alumno

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | Next.js 14 + TypeScript + TailwindCSS + Shadcn/ui |
| **Backend** | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| **Seguridad** | Row Level Security (RLS) |
| **IA** | Motor de reglas (MVP) → LLM (futuro) |

## 👥 Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| **Alumno** | Estudiante que gestiona su plan de orientación |
| **Familia** | Padre/madre/tutor legal con acceso a hijos vinculados |
| **Tutor/Orientador** | Profesional del centro que gestiona planes y eventos |
| **Empresa** | Colaborador externo que propone actividades de orientación |
| **Super Admin** | Administrador de la plataforma |

## 📁 Estructura del Proyecto

```
hackatoon/
├── docs/                          # Documentación de arquitectura
│   ├── 01-arquitectura-general.md
│   ├── 02-roles-permisos.md
│   ├── 03-modulos-funcionales.md
│   ├── 04-modelo-datos.md
│   ├── 05-reglas-rls.md
│   ├── 06-rutas-ui-endpoints.md
│   ├── 07-plan-sprints.md
│   └── 08-mvp-pantallas.md
├── supabase/
│   ├── migrations/                # Migraciones de base de datos
│   │   ├── 00001_initial_schema.sql
│   │   ├── 00002_rls_policies.sql
│   │   └── 00003_functions.sql
│   └── seed.sql                   # Datos de prueba
└── README.md
```

## 🚀 Inicio Rápido

### Requisitos previos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- Git

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd hackatoon

# Instalar dependencias (cuando se cree el frontend)
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar migraciones en Supabase
# (usar Supabase CLI o ejecutar SQL manualmente)

# Iniciar desarrollo
npm run dev
```

### Configuración de Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar las migraciones en orden:
   - `00001_initial_schema.sql`
   - `00002_rls_policies.sql`
   - `00003_functions.sql`
3. Ejecutar `seed.sql` para datos de prueba
4. Copiar las credenciales al `.env.local`

## 📖 Documentación

Toda la documentación de arquitectura está en la carpeta `/docs`:

- **[Arquitectura General](docs/01-arquitectura-general.md)**: Visión del sistema y stack
- **[Roles y Permisos](docs/02-roles-permisos.md)**: Matriz de permisos por rol
- **[Módulos Funcionales](docs/03-modulos-funcionales.md)**: Funcionalidades detalladas
- **[Modelo de Datos](docs/04-modelo-datos.md)**: Esquema de base de datos
- **[Reglas RLS](docs/05-reglas-rls.md)**: Políticas de seguridad
- **[Rutas y Endpoints](docs/06-rutas-ui-endpoints.md)**: API y páginas
- **[Plan de Sprints](docs/07-plan-sprints.md)**: Roadmap de desarrollo
- **[Pantallas MVP](docs/08-mvp-pantallas.md)**: Wireframes por rol

## 🗓️ Roadmap

### Fase 1 - MVP (12 semanas)
- ✅ Arquitectura y documentación
- [ ] Auth + Onboarding
- [ ] Perfiles y vinculación familiar
- [ ] Planes de orientación
- [ ] Eventos e inscripciones
- [ ] Recursos y mensajería

### Fase 2 - Funcionalidades Completas (8 semanas)
- [ ] Módulo de empresas
- [ ] Catálogo formativo y comparador
- [ ] Cuestionarios e IA básica
- [ ] Analíticas y notificaciones

### Fase 3 - Avanzado (8 semanas)
- [ ] IA con LLM
- [ ] Admin avanzado
- [ ] Export y multi-tenant
- [ ] Auditorías y compliance

## 🔒 Seguridad y Privacidad

- **RLS activo** en todas las tablas
- **Empresas sin acceso** a datos personales de alumnos
- **Familias** solo ven datos de hijos vinculados
- **Auditoría** de acciones sensibles
- Cumplimiento **LOPD/GDPR** para datos de menores

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**OrientaFuturo** - Orientación académica para un futuro mejor 🎓
