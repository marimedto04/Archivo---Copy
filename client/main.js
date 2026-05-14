import { httpClient } from './src/shared/utils/httpClient.js'
import { authStore } from './src/modules/auth/store/authStore.js'
import { eventBus } from './src/shared/utils/eventBus.js'
import { auth } from './src/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

import { LoginView } from './src/modules/auth/views/LoginView.js'
import { RegisterView } from './src/modules/auth/views/RegisterView.js'
import { HomeView } from './src/modules/home/views/HomeView.js'
import { DashboardView } from './src/modules/dashboard/views/DashboardView.js'
import { DownloadView } from './src/modules/download/views/DownloadView.js'
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
      // Si ya está autenticado, directo a IA Numi
      if (authStore.isAuthenticated) {
        return navigateToPath('/ia-numi')
      }
      return mountView(HomeView)

    case '/login':
    case '/register':
      // Redirigir siempre a inicio ya que el login/registro están allí
      return navigateToPath('/')

    case '/dashboard':
      return mountView(DashboardView)

    case '/download':
      return mountView(DownloadView)

    case '/ia-numi':
      if (!authStore.isAuthenticated) return navigateToPath('/')
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

  // Lógica del dropdown de usuario
  if (e.target.closest('#user-menu-toggle')) {
    e.preventDefault();
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  } else if (e.target.closest('#btn-logout-nav')) {
    e.preventDefault();
    eventBus.emit('auth:logout');
  } else {
    // Hide dropdown if clicked outside
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown && dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
    }
  }
})

// ── Arranque ───────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const containerEl = document.querySelector(container);
  if (containerEl) {
    containerEl.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;color:#fff;"><h2>Verificando sesión...</h2></div>';
  }
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const { getDoc, doc } = await import('firebase/firestore');
        const { db } = await import('./src/firebase.js');
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        
        let grade = 3; // Default
        let name = user.displayName || '';
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          grade = data.grado || data.grade || 3;
          if (!name) name = data.nombre || '';
        }
        
        // Asignación automática de nivel según grado
        let level = 1;
        if (grade == 3) level = 1;
        if (grade == 4) level = 2;
        if (grade == 5) level = 3;

        authStore.setSession({ 
          user: { uid: user.uid, email: user.email, name, grade, level } 
        });
      } catch (e) {
        console.error("Error fetching user profile:", e);
        authStore.setSession({ 
          user: { uid: user.uid, email: user.email, name: user.displayName || '', grade: 3, level: 1 } 
        });
      }
    } else {
      authStore.clearSession()
    }
    handleRoute()
  })
})

// ── Eventos globales de autenticación ──────────────────────────────────────

// Login exitoso → IA Numi
eventBus.on('auth:loginSuccess', () => navigateToPath('/ia-numi'))

// Registro exitoso → IA Numi
// (RegisterViewModel ya guarda nombre+personaje+grado en un solo paso)
eventBus.on('auth:registerSuccess', () => navigateToPath('/ia-numi'))

// Logout
eventBus.on('auth:logout', async () => {
  try {
    const { authService } = await import('./src/modules/auth/services/AuthService.js');
    await authService.logout();
  } catch(e) {
    console.error(e);
  }
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