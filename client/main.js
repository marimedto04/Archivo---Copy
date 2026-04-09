import { httpClient } from './src/shared/utils/httpClient.js'
import { authStore } from './src/modules/auth/store/authStore.js'
import { eventBus } from './src/shared/utils/eventBus.js'

import { LoginView } from './src/modules/auth/views/LoginView.js'
import { DashboardView } from './src/modules/dashboard/views/DashboardView.js'
import { LandingView } from './src/modules/landing/views/LandingView.js'
import { SubjectSelectorView } from './src/modules/chatbot/views/SubjectSelectorView.js'
import { ChatView } from './src/modules/chatbot/views/ChatView.js'

// ── Configuración ─────────────────────────────────────────────────────────────
httpClient.setBaseUrl('http://localhost:3000')

authStore.restore()
if (authStore.token) httpClient.setAuthToken(authStore.token)

// ── Router ────────────────────────────────────────────────────────────────────
let currentView = null

async function navigateTo(ViewClass, opts = {}) {
  if (currentView) currentView.destroy()
  currentView = new ViewClass({ container: '#app', ...opts })
  await currentView.mount()
}

// ── Inicio ────────────────────────────────────────────────────────────────────
authStore.isAuthenticated ? navigateTo(DashboardView) : navigateTo(LandingView)

// ── Eventos globales ──────────────────────────────────────────────────────────
eventBus.on('auth:loginSuccess', () => navigateTo(DashboardView))
eventBus.on('navigation:goToLogin', () => navigateTo(LoginView))
eventBus.on('auth:logout', () => {
  authStore.clearSession()
  httpClient.clearAuthToken()
  navigateTo(LandingView)
})

// ── Eventos del chatbot ───────────────────────────────────────────────────────
eventBus.on('navigation:openChatbot', () => navigateTo(SubjectSelectorView))
eventBus.on('chatbot:subjectSelected', ({ subject, level }) => navigateTo(ChatView, { subject, level }))
eventBus.on('chatbot:back', () => navigateTo(SubjectSelectorView))