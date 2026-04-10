import { BaseView } from '../../../core/BaseView.js';
import { DownloadViewModel } from '../viewmodels/DownloadViewModel.js';

import { NavComponent } from '../../../shared/components/NavComponent.js';
import { HeroComponent } from './components/HeroComponent.js';
import { InstructionsComponent } from './components/InstructionsComponent.js';
import { FaqComponent } from './components/FaqComponent.js';
import { FooterComponent } from './components/FooterComponent.js';

export class DownloadView extends BaseView {
    constructor(options = {}) {
        const viewModel = options.viewModel || new DownloadViewModel();
        super({ ...options, viewModel });
    }

    render() {
        return `
            <div class="download-module-container">
                ${NavComponent()}
                ${HeroComponent()}
                
                <div class="content-download">
                    ${InstructionsComponent()}
                    ${FaqComponent()}
                </div>

                ${FooterComponent()}
            </div>
        `;
    }

    _bindViewModel() {}

    _bindEvents() {
        // Eventos de navegación manejados por History API

        // Evento opcional para el boton circular de descarga
        this._addEvent('#hero-btn-download', 'click', () => {
            alert('¡Descarga iniciada de Numi!');
        });
    }
}
