import logoNumi from '../../../assets/styles/images/logo-numi.png';

export const NavComponent = () => `
  <nav class="home-nav">
      <img src="${logoNumi}" alt="Numi" class="logo-img">
      <div class="nav-links">
          <a href="/" data-link>Inicio</a>
          <a href="/dashboard" data-link>¿Qué es numi?</a>
          <a href="/download" data-link>Descargar</a>
          <a href="/ia-numi" data-link>IA numi</a>

          <a href="/login" class="user-icon-link" data-link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </a>


      </div>
  </nav>
`;
