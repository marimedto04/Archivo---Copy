export const HeroComponent = () => `
    <section class="hero-download">
        <img src="assets/img/mono.png" class="hero-monkey" alt="Mono animado">

        <h1>Descarga la app en tu móvil</h1>
        <p class="hero-desc">
            Lleva Numi contigo y accede a una experiencia de aprendizaje diseñada para niños, con actividades, juegos o
            historias que funcionan sin internet. Aprende en cualquier momento y lugar.
        </p>

        <div class="download-box">
            <div class="btn-download" id="hero-btn-download">
                <svg viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
            </div>
            <span class="download-label">Para android y IOS</span>
        </div>

        <div class="hero-nubes">
            <img src="assets/img/nubes.png" alt="Nubes decorativas">
        </div>
    </section>
`;
