# OrientaFuturo - Roles y Permisos

## 1. Matriz de Roles

| Rol | Descripción | Ámbito de acceso |
|-----|-------------|------------------|
| **Alumno** | Estudiante de ESO/Bachillerato/FP | Solo sus propios datos |
| **Familia** | Padre/Madre/Tutor legal | Alumnos vinculados |
| **Tutor/Orientador** | Profesional del centro educativo | Alumnos de su centro/grupo |
| **Empresa** | Colaborador externo (orientación) | Solo sus propuestas |
| **Super Admin** | Administrador de plataforma | Acceso global |

---

## 2. Permisos Detallados por Rol

### 2.1 Alumno

| Módulo | Acción | Permitido |
|--------|--------|-----------|
| **Plan personal** | Ver su plan, hitos, tareas | ✅ |
| **Plan personal** | Marcar tareas como completadas | ✅ |
| **Plan personal** | Subir evidencias (archivos) | ✅ |
| **Cuestionarios** | Completar test de intereses | ✅ |
| **Cuestionarios** | Ver resultados propios | ✅ |
| **Eventos** | Ver eventos disponibles | ✅ |
| **Eventos** | Inscribirse a eventos | ✅ |
| **Eventos** | Cancelar inscripción | ✅ |
| **Eventos** | Enviar feedback post-evento | ✅ |
| **Recursos** | Ver recursos recomendados | ✅ |
| **Recursos** | Guardar favoritos | ✅ |
| **Mensajería** | Enviar mensaje a Tutor/Orientador | ✅ |
| **Mensajería** | Ver historial de conversaciones | ✅ |
| **Perfil** | Editar preferencias y avatar | ✅ |
| **Perfil** | Ver datos de otros alumnos | ❌ |
| **Admin** | Cualquier acción administrativa | ❌ |

### 2.2 Familia

| Módulo | Acción | Permitido |
|--------|--------|-----------|
| **Alumnos vinculados** | Ver lista de hijos/tutelados | ✅ |
| **Plan del alumno** | Ver plan de alumnos vinculados | ✅ |
| **Plan del alumno** | Ver progreso y tareas completadas | ✅ |
| **Plan del alumno** | Editar plan del alumno | ❌ |
| **Guía post-ESO** | Acceder a guía completa | ✅ |
| **Comparador** | Comparar opciones formativas | ✅ |
| **Eventos** | Ver eventos donde participa su hijo | ✅ |
| **Eventos** | Inscribir al alumno | ❌ (lo hace el alumno) |
| **Recursos** | Ver recursos para familias | ✅ |
| **Mensajería** | Contactar con Tutor/Orientador | ✅ |
| **Mensajería** | Ver mensajes del alumno | ❌ (privacidad) |
| **Datos sensibles** | Ver notas académicas detalladas | ❌ |
| **Datos sensibles** | Ver resultados test psicológicos | ❌ |

### 2.3 Tutor/Orientador

| Módulo | Acción | Permitido |
|--------|--------|-----------|
| **Alumnos** | Ver alumnos de su centro/grupo | ✅ |
| **Alumnos** | Ver perfil completo del alumno | ✅ |
| **Alumnos** | Ver alumnos de otros centros | ❌ |
| **Planes** | Crear plan para alumno | ✅ |
| **Planes** | Editar hitos y tareas | ✅ |
| **Planes** | Asignar recursos al plan | ✅ |
| **Eventos centro** | Crear eventos del centro | ✅ |
| **Eventos centro** | Editar/cancelar eventos propios | ✅ |
| **Eventos empresa** | Ver propuestas de empresas | ✅ |
| **Eventos empresa** | Aprobar/rechazar propuestas | ✅ |
| **Recursos** | Crear recursos del centro | ✅ |
| **Recursos** | Editar recursos propios | ✅ |
| **Recursos** | Eliminar recursos | ✅ |
| **Artículos empresa** | Revisar artículos propuestos | ✅ |
| **Artículos empresa** | Aprobar/rechazar artículos | ✅ |
| **Analíticas** | Ver participación agregada | ✅ |
| **Analíticas** | Ver intereses agregados (anónimo) | ✅ |
| **Mensajería** | Responder a alumnos y familias | ✅ |
| **Mensajería** | Iniciar conversación con familia | ✅ |
| **Mensajería empresa** | Comunicarse con empresas | ✅ |

### 2.4 Empresa

| Módulo | Acción | Permitido |
|--------|--------|-----------|
| **Propuestas** | Crear propuesta de charla | ✅ |
| **Propuestas** | Crear propuesta de taller | ✅ |
| **Propuestas** | Crear propuesta de visita | ✅ |
| **Propuestas** | Crear propuesta de artículo | ✅ |
| **Propuestas** | Ver estado de sus propuestas | ✅ |
| **Propuestas** | Editar propuestas pendientes | ✅ |
| **Propuestas** | Cancelar propuestas | ✅ |
| **Estadísticas** | Ver nº inscripciones (agregado) | ✅ |
| **Estadísticas** | Ver feedback agregado | ✅ |
| **Mensajería** | Comunicarse con centros | ✅ |
| **Datos alumnos** | Ver lista de alumnos | ❌ |
| **Datos alumnos** | Ver nombres de inscritos | ❌ |
| **Datos alumnos** | Ver datos personales | ❌ |
| **Eventos** | Publicar directamente | ❌ (requiere aprobación) |

### 2.5 Super Admin

| Módulo | Acción | Permitido |
|--------|--------|-----------|
| **Centros** | CRUD completo de centros | ✅ |
| **Usuarios** | CRUD completo de usuarios | ✅ |
| **Usuarios** | Asignar/cambiar roles | ✅ |
| **Usuarios** | Desactivar cuentas | ✅ |
| **Empresas** | Aprobar/rechazar empresas | ✅ |
| **Moderación** | Revisar contenido reportado | ✅ |
| **Moderación** | Eliminar contenido inapropiado | ✅ |
| **Sistema** | Ver logs de auditoría | ✅ |
| **Sistema** | Ver errores y feedback | ✅ |
| **Sistema** | Health checks y métricas | ✅ |
| **Sistema** | Activar modo mantenimiento | ✅ |
| **Datos** | Exportar datos (backup) | ✅ |
| **Datos** | Importar datos | ✅ |
| **Impersonación** | Actuar como otro usuario* | ✅* |

> *Impersonación solo en entorno de soporte, con auditoría completa y justificación obligatoria.

---

## 3. Modelo de Roles en el Sistema

### 3.1 Almacenamiento del Rol

```sql
-- Tabla profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('student', 'family', 'tutor', 'company', 'admin')),
  center_id UUID REFERENCES centers(id),
  -- ...
);
```

### 3.2 JWT Claims

Al autenticarse, el JWT incluye:

```json
{
  "sub": "uuid-del-usuario",
  "role": "student",
  "center_id": "uuid-del-centro",
  "aud": "authenticated",
  "exp": 1234567890
}
```

### 3.3 Función de Validación

```sql
-- Obtener rol del usuario actual
CREATE OR REPLACE FUNCTION auth.role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- Obtener centro del usuario actual
CREATE OR REPLACE FUNCTION auth.center_id()
RETURNS UUID AS $$
  SELECT center_id FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- Verificar si es admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
$$ LANGUAGE SQL SECURITY DEFINER;
```

---

## 4. Flujo de Asignación de Roles

### 4.1 Registro de Alumno

```
1. Centro crea invitación con código único
2. Alumno se registra con código
3. Sistema asigna rol 'student' + center_id
4. Tutor valida y activa cuenta
```

### 4.2 Vinculación Familia-Alumno

```
1. Familia se registra (rol 'family')
2. Solicita vinculación con alumno (DNI/código)
3. Centro/Tutor aprueba vinculación
4. Se crea registro en guardian_links
```

### 4.3 Alta de Empresa

```
1. Empresa solicita registro
2. Super Admin revisa y aprueba
3. Se asigna rol 'company'
4. Empresa puede crear propuestas
```

---

## 5. Restricciones de Privacidad

### 5.1 Datos que NUNCA ve la Empresa

- Nombres de alumnos
- DNI/NIE
- Direcciones
- Teléfonos
- Emails personales
- Notas académicas
- Resultados de tests
- Historial de mensajes

### 5.2 Datos que ve la Empresa (agregados)

- Número total de inscripciones a su evento
- Distribución por curso (ej: "3º ESO: 15, 4º ESO: 23")
- Puntuación media de feedback (sin comentarios identificables)
- Número de visualizaciones de sus artículos

### 5.3 Datos sensibles del Alumno (solo Tutor/Orientador)

- Resultados de cuestionarios de intereses
- Notas del orientador
- Historial de tutorías
- Informes de seguimiento
