import logoNumi from '../../../assets/styles/images/logo-numi.png';

export const NavComponent = () => `
  <nav class="home-nav">
      <img src="${logoNumi}" alt="Numi" class="logo-img">
      <div class="nav-links">
          <a href="/" data-link>Inicio</a>
          <a href="/dashboard" data-link>¿Qué es numi?</a>
          <a href="/download" data-link>Descargar</a>
          <a href="/dashboard" data-link>Mi numi</a>
      </div>
  </nav>
`;
