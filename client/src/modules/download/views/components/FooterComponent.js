export const FooterComponent = () => `
    <footer>
        <div class="footer-wave" style="top: -60px;">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
                <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"></path>
            </svg>
        </div>

        <img src="assets/img/mono.png" alt="Mono" class="footer-monkey">

        <div class="footer-left">
            <img src="assets/img/logo-numi.png" alt="Numi" class="logo-img">
            <p>Numi es una aplicación educativa infantil que ofrece actividades y experiencias de aprendizaje adaptadas
                a las necesidades de los niños.</p>
        </div>

        <div class="footer-links">
            <a href="#" class="nav-link-inicio">Inicio</a>
            <a href="#">¿Qué es numi?</a>
            <a href="#" class="nav-link-descargar">Descargar</a>
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
