export const FooterComponent = () => `
  <footer>
      <div class="footer-wave-top">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path
                  d="M0,60L80,48C160,36,320,12,480,17.3C640,23,800,57,960,64C1120,71,1280,51,1360,41.3L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z">
              </path>
          </svg>
      </div>

      <div class="footer-left">
          <img src="assets/img/logo-numi.png" alt="Numi" class="logo-img">
          <p>Numi es una aplicación educativa infantil que ofrece actividades y experiencias de aprendizaje adaptadas
              a las necesidades de los niños.</p>
      </div>

      <div class="footer-links">
          <a href="#">Inicio</a>
          <a href="#">¿Qué es numi?</a>
          <a href="#">Descargar</a>
          <a href="#">Mi numi</a>
      </div>

      <div class="footer-download">
          <svg viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Descargar app</span>
      </div>
  </footer>
`;
