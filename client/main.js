import { httpClient } from './src/shared/utils/httpClient.js'
import { authStore } from './src/modules/auth/store/authStore.js'
import { eventBus } from './src/shared/utils/eventBus.js'

import { LoginView } from './src/modules/auth/views/LoginView.js'
import { DashboardView } from './src/modules/dashboard/views/DashboardView.js'
import { DownloadView } from './src/modules/download/views/DownloadView.js'
import { HomeView } from './src/modules/home/views/HomeView.js'
import { SubjectSelectorView } from './src/modules/chatbot/views/SubjectSelectorView.js'
import { ChatView } from './src/modules/chatbot/views/ChatView.js'

// ── Configuración ─────────────────────────────────────────────────────────────
httpClient.setBaseUrl('http://localhost:3000')

authStore.restore()
if (authStore.token) httpClient.setAuthToken(authStore.token)

// ── Router (SPA tipo React Router) ────────────────────────────────────────────
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
      return mountView(HomeView)
    case '/login':
      return mountView(LoginView)
    case '/dashboard':
      return mountView(DashboardView)
    case '/download':
      return mountView(DownloadView)
    case '/chat-subjects':
      return mountView(SubjectSelectorView)
    case '/chat':
      const state = window.history.state || {}
      return mountView(ChatView, state)
    default:
      return mountView(HomeView)
  }
}

window.addEventListener('popstate', handleRoute)

// Interceptar todos los clicks en enlaces con "data-link"
document.body.addEventListener('click', e => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault()
    navigateToPath(e.target.getAttribute('href'))
  } else if (e.target.closest('[data-link]')) {
    e.preventDefault()
    navigateToPath(e.target.closest('[data-link]').getAttribute('href'))
  }
})

// ── Inicio ────────────────────────────────────────────────────────────────────
// Iniciar la ruta actual al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/' && authStore.isAuthenticated) {
     navigateToPath('/dashboard')
  } else {
     handleRoute()
  }
})

// ── Eventos globales ──────────────────────────────────────────────────────────
eventBus.on('auth:loginSuccess', () => navigateToPath('/dashboard'))
eventBus.on('navigation:goToLogin', () => navigateToPath('/login'))
eventBus.on('auth:logout', () => {
  authStore.clearSession()
  httpClient.clearAuthToken()
  navigateToPath('/')
})

eventBus.on('navigation:goToHome', () => navigateToPath('/'))
eventBus.on('navigation:goToDownload', () => navigateToPath('/download'))

// ── Eventos del chatbot ───────────────────────────────────────────────────────
eventBus.on('navigation:openChatbot', () => navigateToPath('/chat-subjects'))
eventBus.on('chatbot:subjectSelected', ({ subject, level }) => navigateToPath('/chat', { subject, level }))
eventBus.on('chatbot:back', () => navigateToPath('/chat-subjects'))