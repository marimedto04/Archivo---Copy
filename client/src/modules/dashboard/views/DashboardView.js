import { BaseView } from '../../../core/BaseView.js';
import { DashboardViewModel } from '../viewmodels/DashboardViewModel.js';

import { NavComponent } from '../../../shared/components/NavComponent.js';
import { HeroComponent } from './components/HeroComponent.js';
import { WelcomeComponent } from './components/WelcomeComponent.js';
import { ClassesComponent } from './components/ClassesComponent.js';
import { BenefitsComponent } from './components/BenefitsComponent.js';
import { AppPreviewComponent } from './components/AppPreviewComponent.js';
import { FooterComponent } from './components/FooterComponent.js';

export class DashboardView extends BaseView {
  constructor(options = {}) {
    const viewModel = options.viewModel || new DashboardViewModel();
    super({ ...options, viewModel });
  }

  render() {
    return `
      <div class="dashboard-container">
        ${NavComponent()}
        ${HeroComponent()}
        ${WelcomeComponent()}
        ${ClassesComponent()}
        ${BenefitsComponent()}
        ${AppPreviewComponent()}
        ${FooterComponent()}
      </div>
    `;
  }

  _bindViewModel() {
    // Escuchar cambios específicos si se conectan datos eventualmente
  }

  _bindEvents() {
    // Ejemplo de evento
    this._addEvent('.btn', 'click', (e) => {
      e.preventDefault();
      // Lógica opcional
    });
  }
}
