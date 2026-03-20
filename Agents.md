# Agents.md — Reglas del Proyecto

> Este archivo es la fuente de verdad para todos los equipos que trabajan en el proyecto.
> Todo agente de IA, desarrollador o equipo **debe leer y respetar** estas reglas antes de
> contribuir al código.

---

## 1. Arquitectura: MVVM por módulos

El proyecto usa el patrón **Model – View – ViewModel (MVVM)** organizado en módulos
independientes. Cada módulo pertenece a un dominio de negocio y puede ser desarrollado
por un equipo distinto sin interferir con los demás.

```
client/src/modules/<nombre-modulo>/
  ├── models/          → Entidades de datos y validaciones
  ├── viewmodels/      → Lógica de presentación y estado de UI
  ├── views/           → Renderizado HTML y eventos DOM
  ├── services/        → Acceso a datos (HTTP, WebSocket, etc.)
  └── store/           → Estado compartido dentro del módulo
```

---

## 2. Responsabilidades por capa

### 2.1 Model
- Almacena los datos de una entidad de negocio.
- Valida la integridad de esos datos (`validate()`).
- Notifica cambios de propiedades a sus suscriptores.
- **No conoce** ni la View ni el ViewModel.
- **No hace** llamadas HTTP.

### 2.2 ViewModel
- Es el único intermediario entre el Model y la View.
- Mantiene el estado de la UI (`isLoading`, `error`, campos de formulario, etc.).
- Expone **comandos** (métodos públicos) que la View puede invocar.
- Orquesta llamadas a los Services.
- **No manipula** el DOM directamente.
- **No importa** ninguna clase de View.

### 2.3 View
- Renderiza el HTML del módulo (`render()` retorna un string).
- Se suscribe a los cambios del ViewModel y actualiza el DOM.
- Captura eventos del usuario y los delega al ViewModel.
- **No contiene** lógica de negocio.
- **Solo se comunica** con su ViewModel asignado.
- **No llama** a Services ni Models directamente.

### 2.4 Service
- Realiza las llamadas de red (siempre usando `httpClient`, nunca `fetch` directo).
- Retorna datos crudos; **no modifica** Models ni Stores.
- Es el ViewModel quien decide qué hacer con lo retornado.

### 2.5 Store (por módulo)
- Es la única fuente de verdad del estado del módulo.
- **Solo los ViewModels del propio módulo** escriben en él.
- Otros módulos pueden **leer** del store, pero **nunca escribir**.
- Para notificar cambios entre módulos se usa el `eventBus`, no el store directamente.

---

## 3. Comunicación entre módulos

| Necesidad | Mecanismo correcto |
|---|---|
| View ↔ ViewModel (mismo módulo) | `_subscribe()` + `setState()` de BaseView/BaseViewModel |
| ViewModel lee datos de otro módulo | Lee del `store` público del módulo destino (solo lectura) |
| Notificación entre módulos distintos | `eventBus.emit('modulo:evento', payload)` |
| Datos compartidos de sesión | `authStore` (lectura pública, escritura solo desde auth) |

**Prohibido:**
- Importar un ViewModel de otro módulo desde una View.
- Importar una View desde un ViewModel.
- Que un módulo llame directamente a un Service de otro módulo.

---

## 4. Reglas de nombrado

### 4.1 Archivos

| Tipo | Convención | Ejemplo |
|---|---|---|
| Clases (Model, ViewModel, View, Controller, Service) | PascalCase + sufijo del tipo | `UserModel.js`, `LoginViewModel.js`, `DashboardView.js` |
| Stores | camelCase + `Store` | `authStore.js`, `dashboardStore.js` |
| Utilidades / helpers | camelCase | `eventBus.js`, `httpClient.js` |
| Rutas de servidor | `[modulo].routes.js` | `auth.routes.js` |
| Controladores de servidor | `[modulo].controller.js` | `auth.controller.js` |
| Servicios de servidor | `[modulo].service.js` | `auth.service.js` |
| Estilos CSS | kebab-case | `main.css`, `login-card.css` |

### 4.2 Clases

```js
// ✅ Correcto — PascalCase + sufijo descriptivo
class UserModel {}
class LoginViewModel {}
class DashboardView {}
class AuthController {}
class AuthService {}       // server-side
class AuthStore {}         // (clase interna del store)

// ❌ Incorrecto
class user {}
class loginVM {}
class Dashboard_View {}
```

### 4.3 Funciones y métodos

```js
// ✅ Correcto — camelCase, verbos descriptivos
function fetchUserData() {}
function validateForm() {}
async function submitLogin() {}

// Métodos privados (prefijo _ )
function _sanitizeUser() {}
function _buildQueryParams() {}

// ❌ Incorrecto
function FetchUser() {}    // PascalCase reservado para clases
function fetch_user() {}   // snake_case no se usa en JS
function doStuff() {}      // nombre no descriptivo
```

### 4.4 Variables y constantes

```js
// ✅ Variables — camelCase
let isLoading = false
let currentUser = null
let emailErrorMessage = ''

// ✅ Constantes de módulo — camelCase (singletons)
export const authStore = new AuthStore()
export const httpClient = new HttpClient()

// ✅ Constantes de configuración — SCREAMING_SNAKE_CASE
const MAX_RETRY_COUNT = 3
const DEFAULT_TIMEOUT_MS = 5000

// ❌ Incorrecto
let IsLoading = false       // PascalCase en variable
let email_error = ''        // snake_case
const AUTHSTORE = new AuthStore()  // singleton no es una constante de config
```

### 4.5 Eventos del EventBus

El nombre del evento sigue el patrón `modulo:accion` en camelCase:

```js
// ✅ Correcto
eventBus.emit('auth:loginSuccess', payload)
eventBus.emit('auth:logout')
eventBus.emit('dashboard:dataLoaded', data)
eventBus.emit('notifications:newMessage', msg)

// ❌ Incorrecto
eventBus.emit('LOGIN_SUCCESS')       // SCREAMING_SNAKE no aplica
eventBus.emit('loginSuccess')        // falta el prefijo del módulo
eventBus.emit('auth_login_success')  // snake_case
```

### 4.6 IDs y selectores CSS en HTML

```html
<!-- ✅ kebab-case para IDs y clases -->
<div id="login-form" class="login-card">
  <input id="email-input" class="form-input form-input--error" />
</div>

<!-- ❌ Incorrecto -->
<div id="loginForm" class="loginCard"></div>
```

### 4.7 Clases CSS (convención BEM)

```css
/* Bloque */
.login-card {}

/* Elemento (doble guion bajo) */
.login-card__title {}
.login-card__footer {}

/* Modificador (doble guion medio) */
.btn--primary {}
.form-input--error {}
.metric-card--highlighted {}
```

---

## 5. Estructura de un módulo nuevo

Al crear un módulo nuevo, seguir este checklist:

```
client/src/modules/<nombre>/
  ├── models/
  │   └── <Nombre>Model.js          ← extiende BaseModel
  ├── viewmodels/
  │   └── <Nombre>ViewModel.js      ← extiende BaseViewModel
  ├── views/
  │   └── <Nombre>View.js           ← extiende BaseView
  ├── services/
  │   └── <Nombre>Service.js        ← usa httpClient
  └── store/
      └── <nombre>Store.js          ← singleton del módulo

server/src/modules/<nombre>/
  ├── <nombre>.routes.js
  ├── <nombre>.controller.js        ← extiende BaseController
  └── <nombre>.service.js           ← extiende BaseService
```

**Checklist de nuevo módulo:**
- [ ] El Model extiende `BaseModel` y define `defaults()` y `validate()`
- [ ] El ViewModel extiende `BaseViewModel` y **no importa** ninguna View
- [ ] La View extiende `BaseView` e implementa `render()`, `_bindViewModel()` y `_bindEvents()`
- [ ] El Service usa **solo** `httpClient` para llamadas HTTP
- [ ] El Store es un **singleton** exportado con `export const`
- [ ] Las rutas de servidor se registran en `server/index.js`
- [ ] Los nombres de archivos siguen la convención de la sección 4.1
- [ ] Los eventos del EventBus tienen el prefijo del módulo

---

## 6. Reglas de los agentes IA

> Esta sección es específica para agentes de IA (Claude, Copilot, Cursor, etc.)
> que contribuyan código a este proyecto.

### 6.1 Antes de generar código

1. Leer este archivo (`Agents.md`) completo.
2. Identificar en qué módulo y capa corresponde el cambio.
3. Nunca crear archivos fuera de la estructura definida sin aprobación.

### 6.2 Restricciones absolutas

- **No usar TypeScript.** El proyecto es JavaScript puro. Sin interfaces, tipos, enums ni decoradores.
- **No importar** entre capas prohibidas (ver sección 3).
- **No usar `fetch` directamente** en Services. Siempre usar `httpClient`.
- **No escribir lógica de negocio** en Views ni Controllers.
- **No acceder a `process.env`** fuera de `server/src/config/index.js`.
- **No crear singletons nuevos** fuera de los Stores y utilidades de `shared/`.
- **No mezclar** responsabilidades de server y client dentro del mismo archivo.

### 6.3 Al agregar una nueva funcionalidad

1. Crear el módulo completo en la carpeta correspondiente (client y/o server).
2. Registrar la ruta nueva en `server/index.js` con comentario explicativo.
3. Si el módulo emite eventos al EventBus, documentarlos en el Store del módulo.
4. Si el módulo lee del store de otro módulo, documentarlo con un comentario en el ViewModel.

### 6.4 Al modificar código existente

1. Mantener la firma de los métodos públicos (no romper contratos).
2. Los métodos prefijados con `_` son privados: no llamarlos desde fuera de la clase.
3. Actualizar los comentarios JSDoc si la firma o el comportamiento cambian.
4. No remover métodos del BaseModel, BaseViewModel ni BaseView sin aprobación.

### 6.5 Calidad de código

- Cada función/método debe tener un comentario JSDoc con `@param` y `@returns`.
- Las funciones no deben superar 40 líneas. Si lo hacen, extraer en subfunciones.
- Nombrar las variables con claridad: evitar `data`, `obj`, `temp`, `x`, `item` sin contexto.
- Preferir `async/await` sobre `.then()/.catch()`.
- Preferir `const` sobre `let`. Nunca usar `var`.

---

## 7. Flujo de datos (resumen visual)

```
Usuario
  │
  ▼
[View]  ──────── delega eventos ──────────► [ViewModel]
  │                                              │
  │  se suscribe a cambios de estado             │  lee / escribe
  │◄─────────────────────────────────────────────┤
                                                 │
                                          [Service] ──► API / Backend
                                                 │
                                          [Store]  ◄── solo este módulo escribe
                                                 │
                                     ─── eventBus ──► otros módulos (solo lectura)
```

---

## 8. Incorporar un nuevo equipo

Cuando un nuevo equipo se une al proyecto:

1. Crear su módulo en `client/src/modules/<nuevo-modulo>/` siguiendo la sección 5.
2. Crear su módulo en `server/src/modules/<nuevo-modulo>/` si necesitan backend.
3. Leer la sección 3 para entender cómo comunicarse con otros módulos.
4. Registrar sus eventos del EventBus en su propio `store` con comentarios.
5. No modificar archivos fuera de su carpeta de módulo sin coordinación con otros equipos.
6. Los cambios a `core/`, `shared/` o `server/src/core/` requieren aprobación de todos los equipos.

---

*Última actualización: generado automáticamente al inicializar el proyecto.*
