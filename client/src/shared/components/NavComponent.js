import logoNumi from '../../../assets/styles/images/logo-numi.png';
import { authStore } from '../../modules/auth/store/authStore.js';

export const NavComponent = () => {
  const isAuth = authStore && authStore.isAuthenticated;
  const userName = isAuth && authStore.user ? (authStore.user.get('name') || 'Usuario') : '';

  return `
  <nav class="home-nav">
      <img src="${logoNumi}" alt="Numi" class="logo-img">
      <div class="nav-links">
          <a href="/" data-link>Inicio</a>
          <a href="/dashboard" data-link>¿Qué es numi?</a>
          <a href="/download" data-link>Descargar</a>
          <a href="/ia-numi" data-link>IA numi</a>
          <a href="/dashboard" data-link>Mi numi</a>
          ${isAuth ? `
          <div class="user-menu-container" style="position: relative; display: inline-block;">
             <a href="#" id="user-menu-toggle" style="cursor: pointer; display: flex; align-items: center; gap: 8px; color: white; text-decoration: none;">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
               ${userName}
             </a>
             <div id="user-dropdown" style="display: none; position: absolute; right: 0; top: 100%; background: #1a1a2e; border: 1px solid #333; border-radius: 8px; padding: 10px; z-index: 100; min-width: 150px; text-align: left;">
                <button id="btn-logout-nav" style="background: transparent; color: #ff4757; border: none; cursor: pointer; width: 100%; text-align: left; padding: 8px; font-size: 16px;">Cerrar sesión</button>
             </div>
          </div>
          ` : `
          <a href="/" class="user-icon-link" data-link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </a>
          `}
      </div>
  </nav>
  `;
};
