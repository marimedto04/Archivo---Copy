import { httpClient } from './src/shared/utils/httpClient.js'
import { authStore } from './src/modules/auth/store/authStore.js'
import { eventBus } from './src/shared/utils/eventBus.js'

import { LoginView } from './src/modules/auth/views/LoginView.js'
import { RegisterView } from './src/modules/auth/views/RegisterView.js'
import { HomeView } from './src/modules/home/views/HomeView.js'
import { DashboardView } from './src/modules/dashboard/views/DashboardView.js'
import { DownloadView } from './src/modules/download/views/DownloadView.js'
import { SubjectSelectorView } from './src/modules/chatbot/views/SubjectSelectorView.js'
import { ChatView } from './src/modules/chatbot/views/ChatView.js'
import { IaNumiView } from './src/modules/ia-numi/views/IaNumiView.js'

// ── Configuración ──────────────────────────────────────────────────────────
httpClient.setBaseUrl('http://localhost:3000')

authStore.restore()
if (authStore.token) httpClient.setAuthToken(authStore.token)

// ── Router ─────────────────────────────────────────────────────────────────
let currentView = null
const container = '#app'

async function mountView(ViewClass, opts = {}) {
  if (currentView) currentView.destroy()
  currentView = new ViewClass({ container, ...opts })
  await currentView.mount()
}

function navigateToPath(path, opts = {}) {
  window.history.pushState(opts, '', path)
  handleRoute()
}

function handleRoute() {
  const path = window.location.pathname

  switch (path) {

    case '/':
      // Si ya está autenticado con perfil completo → dashboard
      if (authStore.isAuthenticated && authStore.user.get('name')) {
        return navigateToPath('/dashboard')
      }
      return mountView(HomeView)

    case '/login':
      if (authStore.isAuthenticated) return navigateToPath('/dashboard')
      return mountView(LoginView)

    case '/register':
      if (authStore.isAuthenticated) return navigateToPath('/dashboard')
      return mountView(RegisterView)

    case '/dashboard':
      if (!authStore.isAuthenticated) return navigateToPath('/')
      return mountView(DashboardView)

    case '/download':
      return mountView(DownloadView)

    case '/chat-subjects':
      return mountView(SubjectSelectorView)

    case '/chat': {
      const state = window.history.state || {}
      return mountView(ChatView, state)
    }

    case '/ia-numi':
      return mountView(IaNumiView)
    default:
      return mountView(HomeView)
  }
}

// Escuchar botón atrás/adelante del navegador
window.addEventListener('popstate', handleRoute)

// Interceptar clicks en <a data-link> para navegación sin recarga
document.body.addEventListener('click', e => {
  const link = e.target.matches('[data-link]')
    ? e.target
    : e.target.closest('[data-link]')
  if (link) {
    e.preventDefault()
    navigateToPath(link.getAttribute('href'))
  }
})

// ── Arranque ───────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => handleRoute())

// ── Eventos globales de autenticación ──────────────────────────────────────

// Login exitoso → dashboard
eventBus.on('auth:loginSuccess', () => navigateToPath('/dashboard'))

// Registro exitoso → dashboard
// (RegisterViewModel ya guarda nombre+personaje+grado en un solo paso)
eventBus.on('auth:registerSuccess', () => navigateToPath('/dashboard'))

// Logout
eventBus.on('auth:logout', () => {
  authStore.clearSession()
  httpClient.clearAuthToken()
  navigateToPath('/')
})

// Navegación general
eventBus.on('navigation:goToLogin', () => navigateToPath('/login'))
eventBus.on('navigation:goToHome', () => navigateToPath('/'))
eventBus.on('navigation:goToDownload', () => navigateToPath('/download'))

// ── Eventos del chatbot ────────────────────────────────────────────────────
eventBus.on('navigation:openChatbot', () => navigateToPath('/chat-subjects'))
eventBus.on('navigation:goToMath', () => navigateToPath('/ia-numi/matematicas'))
eventBus.on('chatbot:subjectSelected', ({ subject, level }) => navigateToPath('/chat', { subject, level }))
eventBus.on('chatbot:back', () => navigateToPath('/chat-subjects'))