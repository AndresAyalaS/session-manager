# Sistema de Gestión de Sesiones

Aplicación Angular desarrollada para la gestión de sesiones empresariales con autenticación basada en roles y calendario interactivo.

## Características

### Autenticación y Roles
- **Login Mock**: Sistema de autenticación simulado con validación de credenciales
- **Roles automáticos**: 
  - Administradores: usuarios con email @sdi.es
  - Usuarios registrados: resto de usuarios autenticados
- **Persistencia de sesión**: Token almacenado en localStorage

### Calendario de Sesiones
- Vista mensual con FullCalendar
- Filtros por categoría (Formación, Reunión, Demo, Workshop, Conferencia)
- Filtros por estado (Publicado, Borrador, Bloqueado, Oculto)
- Búsqueda en tiempo real
- Vista detallada de sesiones al hacer clic

### Panel de Administración
- Creación y edición de sesiones
- Eliminación con permisos basados en ciudad
- Formulario completo con:
  - Imagen opcional
  - Título y descripción
  - Categoría con selector
  - Ciudad
  - Selector de fecha y hora
  - Estados configurables

### Menú de Navegación
- Calendario (visible para todos los usuarios autenticados)
- Administrador (solo visible para administradores)
- Dropdown de usuario con opción de cerrar sesión

## Tecnologías Utilizadas

- **Angular v21**
- **TypeScript**
- **SCSS** para estilos
- **FullCalendar** para el calendario interactivo
- **RxJS** para programación reactiva
- **Guards** para protección de rutas
- **Fuente Satoshi** desde FontShare

## Requisitos Previos

- Node.js (v18 o superior)
- npm (v10 o superior)

## Instalación

```bash
# Navegar a la carpeta del proyecto
cd session-manager

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## Credenciales de Prueba

### Administradores (dominio @sdi.es)
- Email: `admin@sdi.es` | Contraseña: `admin123`
- Email: `maria@sdi.es` | Contraseña: `admin123`

### Usuarios Registrados
- Email: `usuario@gmail.com` | Contraseña: `user123`
- Email: `ana@hotmail.com` | Contraseña: `user123`

## Características de Diseño

- Fuente personalizada Satoshi de FontShare
- Diseño moderno y responsive
- Gradientes y sombras sutiles
- Animaciones suaves en transiciones
- Paleta de colores consistente
- Scrollbar personalizada

## Seguridad

- Rutas protegidas con Guards
- Validación de roles en el cliente
- Persistencia segura de tokens
- Validación de permisos por ciudad para eliminación de sesiones

## Funcionalidades Mock

- Autenticación simulada con usuarios predefinidos
- Gestión de sesiones en localStorage
- CRUD completo de sesiones sin backend
- Datos iniciales de ejemplo

## Flujo de Uso

1. **Login**: Iniciar sesión con una de las credenciales de prueba
2. **Calendario**: Ver todas las sesiones en formato calendario
3. **Filtros**: Aplicar filtros por categoría, estado o buscar por texto
4. **Detalles**: Hacer clic en una sesión para ver detalles completos
5. **Admin** (solo administradores):
   - Crear nuevas sesiones
   - Editar sesiones existentes
   - Eliminar sesiones (solo de su misma ciudad)

## Comandos Disponibles

```bash
# Desarrollo
npm start

# Build de producción
npm run build

# Tests
npm test

# Linting
npm run lint
```

## Build para Producción

```bash
npm run build
```

