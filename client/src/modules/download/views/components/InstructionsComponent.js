export const InstructionsComponent = () => `
    <!-- Instrucciones -->
    <div class="section-header">
        <h2>¿Cómo descargar la app?</h2>
        <img src="assets/img/pollo.png" class="pollo-icon" alt="Pollo decorativo">
    </div>

    <details open>
        <summary>Descargarla desde la web</summary>
        <div class="details-body">
            <ol>
                <li>1. Abre www.numi.com en tu buscador Google o Safari</li>
                <li>2. Entra a la pestaña Descargar</li>
                <li>3. Presiona el botón <svg class="icon-inline" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg></li>
                <li>4. Empieza a aprender</li>
            </ol>
        </div>
    </details>

    <details open>
        <summary>Descargarla desde Play Store o App Store</summary>
        <div class="details-body">
            <ol>
                <li>1. Entra a la Play Store o App Store</li>
                <li>2. En el buscador pon Numi</li>
                <li>3. Empieza a descargar la aplicación en tu móvil</li>
                <li>4. Ya estás listo para aprender</li>
            </ol>
        </div>
    </details>
`;
