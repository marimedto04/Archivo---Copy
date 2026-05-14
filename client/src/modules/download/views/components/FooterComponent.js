<<<<<<< HEAD
import mono from '../../../../../assets/styles/images/mono.png';
<<<<<<< HEAD
import logoNumi from '../../../../../assets/styles/images/logo-numi.png';
=======
=======
>>>>>>> e1be2407b5da9c9bb22005f3cd2b310fff38bec8
import footerLogo from '../../../../../assets/styles/images/logo-numi.png';
import descargaImg from '../../../../../assets/styles/images/descarga.png';
>>>>>>> 2aa3d6082f78e743bd76e050a38a5ad94b5c1cbe

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
          <img src="${footerLogo}" alt="Numi" class="logo-img">
          <p>Numi es una aplicación educativa infantil que ofrece actividades y experiencias de aprendizaje adaptadas
              a las necesidades de los niños.</p>
      </div>

<<<<<<< HEAD
        <div class="footer-left">
<<<<<<< HEAD
            <img src="${logoNumi}" alt="Numi" class="logo-img">
=======
            <img src="${footerLogo}" alt="Numi" class="logo-img">
>>>>>>> 2aa3d6082f78e743bd76e050a38a5ad94b5c1cbe
            <p>Numi es una aplicación educativa infantil que ofrece actividades y experiencias de aprendizaje adaptadas
                a las necesidades de los niños.</p>
        </div>

        <div class="footer-links">
            <a href="#" class="nav-link-inicio">Inicio</a>
            <a href="/dashboard" data-link>¿Qué es numi?</a>
            <a href="#" class="nav-link-descargar">Descargar</a>
            <a href="#">Mi numi</a>
        </div>

        <div class="footer-download">
            <img src="${descargaImg}" alt="Descargar" style="width: 40px; height: 40px;">
            <span>Descargar app</span>
        </div>
    </footer>
=======
      <div class="footer-links">
          <a href="#">Inicio</a>
          <a href="#">¿Qué es numi?</a>
          <a href="#">Descargar</a>
          <a href="#">Mi numi</a>
      </div>

      <div class="footer-download">
          <img src="${descargaImg}" alt="Descargar" style="width: 40px; height: 40px;">
          <span>Descargar app</span>
      </div>
  </footer>
>>>>>>> e1be2407b5da9c9bb22005f3cd2b310fff38bec8
`;
