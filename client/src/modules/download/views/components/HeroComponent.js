import mono from '../../../../../assets/styles/images/mono.png';
import nubes from '../../../../../assets/styles/images/nubes.png';
import descargaImg from '../../../../../assets/styles/images/descarga.png';



export const HeroComponent = () => `
    <section class="hero-download">
        <img src="${mono}" class="hero-monkey" alt="Mono animado">

        <h1>Descarga la app en tu móvil</h1>
        <p class="hero-desc">
            Lleva Numi contigo y accede a una experiencia de aprendizaje diseñada para niños, con actividades, juegos o
            historias que funcionan sin internet. Aprende en cualquier momento y lugar.
        </p>

        <div class="download-box">
            <img src="${descargaImg}" alt="Descargar App" id="hero-btn-download" style="width: 130px; height: 130px; cursor: pointer; transition: transform 0.1s;">
            <span class="download-label" style="margin-top: 15px;">Para android y IOS</span>
        </div>

        <div class="hero-nubes">
            <img src="${nubes}" alt="Nubes decorativas">
        </div>
    </section>
`;
