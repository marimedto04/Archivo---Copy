/**
 * client/main.js
 * ---------------
 * Punto de entrada de la aplicación cliente.
 * Inicializa el HttpClient, restaura la sesión y monta la primera vista.
 */

import { httpClient } from './src/shared/utils/httpClient.js'
import { authStore } from './src/modules/auth/store/authStore.js'
import { eventBus } from './src/shared/utils/eventBus.js'
import { LoginView } from './src/modules/auth/views/LoginView.js'
import { DashboardView } from './src/modules/dashboard/views/DashboardView.js'
import { LandingView } from './src/modules/landing/views/LandingView.js'

// ─── Configuración global ──────────────────────────────────────────────────

httpClient.setBaseUrl('http://localhost:3000')

// ─── Restaurar sesión previa ───────────────────────────────────────────────

authStore.restore()

if (authStore.token) {
  httpClient.setAuthToken(authStore.token)
}

// ─── Enrutamiento simple ───────────────────────────────────────────────────

let currentView = null

/**
 * Monta una vista en el contenedor principal y destruye la anterior.
 * @param {typeof import('./src/core/BaseView').BaseView} ViewClass
 */
async function navigateTo(ViewClass) {
  if (currentView) {
    currentView.destroy()
  }

  currentView = new ViewClass({ container: '#app' })
  await currentView.mount()
}

// ─── Lógica de navegación por sesión ─────────────────────────────────────

if (authStore.isAuthenticated) {
  navigateTo(DashboardView)
} else {
  navigateTo(LandingView)
}

// ─── Eventos globales de navegación ──────────────────────────────────────

eventBus.on('auth:loginSuccess', () => {
  navigateTo(DashboardView)
})

eventBus.on('auth:logout', () => {
  authStore.clearSession()
  httpClient.clearAuthToken()
  navigateTo(LandingView)
})

eventBus.on('landing:goToLogin', () => {
  navigateTo(LoginView)
})
