-- ============================================
-- OrientaFuturo - Datos de Prueba (Seeds)
-- ============================================

-- ============================================
-- CENTROS EDUCATIVOS
-- ============================================
INSERT INTO centers (id, name, code, type, address, city, province, postal_code, autonomous_community, email, phone, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'IES Tecnológico Madrid', '28001234', 'mixed', 'Calle de la Educación 123', 'Madrid', 'Madrid', '28001', 'Comunidad de Madrid', 'info@iestecnologico.es', '911234567', true),
  ('22222222-2222-2222-2222-222222222222', 'IES Mediterráneo', '46005678', 'secondary', 'Avenida del Mar 45', 'Valencia', 'Valencia', '46001', 'Comunitat Valenciana', 'secretaria@iesmediterraneo.es', '961234567', true),
  ('33333333-3333-3333-3333-333333333333', 'Colegio San José', '08009012', 'mixed', 'Paseo de Gracia 78', 'Barcelona', 'Barcelona', '08001', 'Catalunya', 'admin@colegiosanjose.es', '931234567', true);

-- ============================================
-- OPCIONES FORMATIVAS (Catálogo)
-- ============================================
INSERT INTO formative_options (category, family, name, official_code, description, duration, access_requirements, career_opportunities, further_studies) VALUES
  -- Bachillerato
  ('bachillerato', NULL, 'Bachillerato de Ciencias y Tecnología', 'BACH-CT', 'Modalidad orientada a estudios universitarios de ciencias, ingenierías y ciencias de la salud.', '2 años', 'Título de ESO', ARRAY['Ingenierías', 'Medicina', 'Ciencias', 'Arquitectura'], ARRAY['Grados universitarios', 'FP Superior']),
  ('bachillerato', NULL, 'Bachillerato de Humanidades y Ciencias Sociales', 'BACH-HCS', 'Modalidad orientada a estudios de humanidades, ciencias sociales, derecho y economía.', '2 años', 'Título de ESO', ARRAY['Derecho', 'Economía', 'Periodismo', 'Psicología'], ARRAY['Grados universitarios', 'FP Superior']),
  ('bachillerato', NULL, 'Bachillerato de Artes', 'BACH-ART', 'Modalidad orientada a estudios artísticos y de diseño.', '2 años', 'Título de ESO', ARRAY['Bellas Artes', 'Diseño', 'Conservación', 'Audiovisuales'], ARRAY['Grados universitarios', 'FP Superior']),
  
  -- FP Grado Medio - Informática
  ('fp_medio', 'Informática y Comunicaciones', 'Técnico en Sistemas Microinformáticos y Redes', 'IFC201', 'Formación para instalar, configurar y mantener sistemas microinformáticos y redes locales.', '2000 horas (2 años)', 'Título de ESO o prueba de acceso', ARRAY['Técnico de soporte', 'Administrador de redes', 'Técnico de sistemas'], ARRAY['FP Superior de Informática', 'Bachillerato']),
  
  -- FP Grado Medio - Sanidad
  ('fp_medio', 'Sanidad', 'Técnico en Cuidados Auxiliares de Enfermería', 'SAN201', 'Formación para proporcionar cuidados auxiliares al paciente y actuar sobre las condiciones sanitarias del entorno.', '1400 horas (1 año)', 'Título de ESO o prueba de acceso', ARRAY['Auxiliar de enfermería', 'Atención sociosanitaria', 'Clínicas dentales'], ARRAY['FP Superior de Sanidad']),
  ('fp_medio', 'Sanidad', 'Técnico en Farmacia y Parafarmacia', 'SAN202', 'Formación para asistir en la dispensación y elaboración de productos farmacéuticos.', '2000 horas (2 años)', 'Título de ESO o prueba de acceso', ARRAY['Auxiliar de farmacia', 'Parafarmacia', 'Almacén farmacéutico'], ARRAY['FP Superior de Sanidad']),
  
  -- FP Grado Medio - Administración
  ('fp_medio', 'Administración y Gestión', 'Técnico en Gestión Administrativa', 'ADG201', 'Formación para realizar actividades de apoyo administrativo en empresas.', '2000 horas (2 años)', 'Título de ESO o prueba de acceso', ARRAY['Auxiliar administrativo', 'Recepcionista', 'Empleado de oficina'], ARRAY['FP Superior de Administración', 'Bachillerato']),
  
  -- FP Grado Superior - Informática
  ('fp_superior', 'Informática y Comunicaciones', 'Técnico Superior en Desarrollo de Aplicaciones Web', 'IFC303', 'Formación para desarrollar, implantar y mantener aplicaciones web.', '2000 horas (2 años)', 'Bachillerato o FP Medio', ARRAY['Desarrollador web', 'Programador', 'Analista'], ARRAY['Grados universitarios de Informática']),
  ('fp_superior', 'Informática y Comunicaciones', 'Técnico Superior en Administración de Sistemas Informáticos en Red', 'IFC302', 'Formación para configurar, administrar y mantener sistemas informáticos.', '2000 horas (2 años)', 'Bachillerato o FP Medio', ARRAY['Administrador de sistemas', 'Técnico de redes', 'Responsable de seguridad'], ARRAY['Grados universitarios de Informática']),
  
  -- FP Básica
  ('fp_basica', 'Informática y Comunicaciones', 'Título Profesional Básico en Informática y Comunicaciones', 'IFC101', 'Formación básica en operaciones auxiliares de montaje y mantenimiento de equipos.', '2000 horas (2 años)', '15-17 años, 3º ESO cursado', ARRAY['Auxiliar de informática', 'Operador de equipos'], ARRAY['FP Grado Medio', 'Título de ESO']);

-- ============================================
-- RECURSOS (Guías y artículos)
-- NOTA: Los recursos se crearán después de tener usuarios.
-- Ejecuta este bloque DESPUÉS de crear el usuario admin.
-- Reemplaza 'UUID-DEL-ADMIN' con el UUID real del admin.
-- ============================================

-- Para insertar recursos después de crear el admin, ejecuta:
/*
INSERT INTO resources (id, center_id, created_by, title, slug, summary, content, resource_type, audience, status, published_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'UUID-DEL-ADMIN', 
   '¿Bachillerato o FP? Guía para decidir', 
   'bachillerato-o-fp-guia',
   'Una guía completa para ayudarte a elegir entre Bachillerato y Formación Profesional.',
   '# ¿Bachillerato o FP?

## Introducción
Al terminar la ESO, te enfrentas a una de las decisiones más importantes de tu vida académica...

## Bachillerato
El Bachillerato es una etapa de 2 años que te prepara para acceder a la universidad...

### Ventajas
- Acceso directo a la universidad
- Formación generalista
- Más tiempo para decidir tu especialización

### Consideraciones
- Requiere buenas notas para carreras con nota de corte alta
- Dos años más de formación teórica

## Formación Profesional
La FP te ofrece una formación más práctica y orientada al mundo laboral...

### Ventajas
- Formación práctica desde el primer día
- Prácticas en empresas reales
- Alta empleabilidad
- Posibilidad de acceder a FP Superior y universidad

### Consideraciones
- Debes elegir una familia profesional
- Algunas especialidades tienen plazas limitadas

## ¿Cómo decidir?
1. Reflexiona sobre tus intereses
2. Habla con tu orientador/a
3. Investiga las salidas profesionales
4. Visita centros de FP y universidades',
   'guide', 'all', 'published', now()),
   
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'UUID-DEL-ADMIN',
   'Guía para familias: Opciones post-ESO',
   'guia-familias-post-eso',
   'Todo lo que las familias necesitan saber sobre las opciones después de la ESO.',
   '# Guía para familias: Opciones post-ESO

## ¿Qué opciones tiene mi hijo/a al terminar la ESO?

### 1. Bachillerato
Duración: 2 años
Requisito: Título de ESO
Salida: Universidad, FP Superior

### 2. FP de Grado Medio
Duración: 2 años (generalmente)
Requisito: Título de ESO
Salida: Mundo laboral, FP Superior

### 3. FP Básica
Para alumnos de 15-17 años que no han completado la ESO
Permite obtener título equivalente a ESO

## ¿Cómo puedo ayudar a mi hijo/a?
- Escucha sus intereses sin imponer
- Acompaña en la búsqueda de información
- Visita juntos jornadas de puertas abiertas
- Habla con el orientador del centro',
   'guide', 'families', 'published', now()),

  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'UUID-DEL-ADMIN',
   'FAQ: Preguntas frecuentes sobre la selectividad',
   'faq-selectividad',
   'Respuestas a las preguntas más comunes sobre la EBAU/Selectividad.',
   '# FAQ: Selectividad (EBAU)

## ¿Qué es la selectividad?
La EBAU (Evaluación del Bachillerato para el Acceso a la Universidad) es el examen que debes aprobar para acceder a la universidad...

## ¿Cuándo se realiza?
Generalmente en junio, con convocatoria extraordinaria en julio...

## ¿Cómo se calcula la nota?
60% nota media de Bachillerato + 40% nota EBAU...

## ¿Puedo subir nota?
Sí, con la fase voluntaria puedes sumar hasta 4 puntos adicionales...',
   'faq', 'students', 'published', now());
*/

-- Tags para recursos (ejecutar DESPUÉS de insertar los recursos)
/*
INSERT INTO resource_tags (resource_id, tag) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'orientacion'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bachillerato'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'fp'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'decisiones'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'para-familias'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'orientacion'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'post-eso'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'selectividad'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'universidad'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'ebau');
*/

-- ============================================
-- NOTA: Los usuarios se crean via Supabase Auth
-- Estos son ejemplos de la estructura que tendrían
-- después de registrarse
-- ============================================

-- Ejemplo de estructura de datos para demo:
-- 
-- ADMIN:
--   auth.users: admin@orientafuturo.es
--   profiles: role='admin', first_name='Admin', last_name='Sistema'
--
-- TUTOR (IES Tecnológico Madrid):
--   auth.users: tutor@iestecnologico.es
--   profiles: role='tutor', center_id='11111111-...', first_name='María', last_name='García'
--
-- ALUMNO:
--   auth.users: alumno@email.com
--   profiles: role='student', center_id='11111111-...', first_name='Carlos', last_name='Martínez'
--   students: current_grade='4eso', interests=['informatica', 'tecnologia']
--
-- FAMILIA:
--   auth.users: familia@email.com
--   profiles: role='family', first_name='Ana', last_name='López'
--   guardian_links: vinculado al alumno Carlos
--
-- EMPRESA:
--   auth.users: empresa@techcorp.es
--   profiles: role='company', first_name='Tech', last_name='Corp'
--   companies: company_name='TechCorp Solutions', status='approved'

-- ============================================
-- EVENTOS DE EJEMPLO (requieren usuarios reales)
-- Se pueden crear después de tener usuarios
-- ============================================

-- Plantilla de evento:
-- INSERT INTO events (center_id, created_by, title, description, event_type, start_datetime, end_datetime, location, max_attendees, target_grades, status) VALUES
--   ('11111111-1111-1111-1111-111111111111', 'UUID_DEL_TUTOR', 
--    'Charla: Conoce la FP de Informática',
--    'Ven a conocer las salidas profesionales de la FP de Informática...',
--    'talk',
--    '2025-02-15 10:00:00+01',
--    '2025-02-15 11:30:00+01',
--    'Salón de actos',
--    50,
--    ARRAY['3eso', '4eso'],
--    'published');

-- ============================================
-- INVITACIONES DE EJEMPLO
-- ============================================

-- Las invitaciones se generan dinámicamente por los tutores
-- Ejemplo de estructura:
-- INSERT INTO invitations (email, role, center_id, code, created_by, expires_at) VALUES
--   (NULL, 'student', '11111111-1111-1111-1111-111111111111', 'ABC12345', 'UUID_TUTOR', now() + interval '30 days');
