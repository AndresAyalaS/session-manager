## Credenciales de Acceso

### Administradores (email @sdi.es)
```
Email: admin@sdi.es
Password: admin123
Ciudad: Madrid

Email: maria@sdi.es
Password: admin123
Ciudad: Barcelona
```

### Usuarios Normales
```
Email: usuario@gmail.com
Password: user123
Ciudad: Madrid

Email: ana@hotmail.com
Password: user123
Ciudad: Valencia
```

## Funcionalidades Implementadas

### Login
- Autenticación mock con validación
- Redirección automática al calendario tras login exitoso
- Roles automáticos según dominio del email (@sdi.es = admin)

### Calendario (Todos los usuarios)
- Vista mensual con FullCalendar
- **Filtros disponibles:**
  - Por categoría: Formación, Reunión, Demo, Workshop, Conferencia
  - Por estado: Publicado, Borrador, Bloqueado, Oculto
  - Búsqueda por texto (título/descripción)
- Click en evento para ver detalles
- Sesiones con colores por categoría

### Panel de Administración (Solo admins)
- **Acceso:** Menú > Administrador
- Lista de todas las sesiones
- Crear nueva sesión (botón "Nueva Sesión")
- Editar sesión
- Eliminar sesión - solo de tu ciudad

### Formulario de Sesiones
- **Campos:**
  - Imagen opcional (upload y preview)
  - Título (mínimo 3 caracteres)
  - Descripción (mínimo 10 caracteres)
  - Categoría (selector)
  - Ciudad (selector)
  - Fecha y hora (picker)
  - Estado (borrador/publicado/bloqueado/oculto)
- Validación en tiempo real

### Menú de Navegación
- Calendario (todos)
- Administrador (solo admins)
- Usuario con dropdown:
  - Muestra nombre y email
  - Badge de rol (Admin/Usuario)
  - Opción cerrar sesión

## Seguridad Implementada

- Guards de autenticación para rutas protegidas
- Guard de admin para panel de administración
- Validación de permisos por ciudad para eliminar
- Persistencia de sesión con localStorage
- Redirección automática según estado de autenticación

## Almacenamiento

Todos los datos se guardan en **localStorage**:
- `session_auth_token`: Token de autenticación
- `session_user_data`: Datos del usuario actual
- `sessions_data`: Todas las sesiones creadas

## Diseño

- Fuente: **Satoshi** (desde fontshare.com)
- Paleta: Gradientes violeta/morado
- Responsive y moderno

## Pruebas Sugeridas

1. **Login como usuario normal:**
   - Verificar que solo ve "Calendario" en el menú
   - No puede acceder a /admin

2. **Login como admin:**
   - Verificar acceso a "Administrador"
   - Crear una sesión nueva
   - Editar sesión existente
   - Intentar eliminar sesión de otra ciudad (debe bloquearse)
   - Eliminar sesión de tu ciudad

3. **Calendario:**
   - Aplicar filtros individuales y combinados
   - Buscar por texto
   - Click en evento para ver modal
   - Verificar colores por categoría

4. **Persistencia:**
   - Refrescar página (debe mantener sesión)
   - Cerrar sesión y verificar redirección
   - Crear sesiones y verificar que persisten


## Datos Mock Iniciales

La aplicación viene con 8 sesiones pre-cargadas de ENERO 2026 para demostración.
