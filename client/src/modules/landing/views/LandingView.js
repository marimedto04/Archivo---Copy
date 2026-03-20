import { BaseView } from '../../../core/BaseView.js';
import { LandingViewModel } from '../viewmodels/LandingViewModel.js';

export class LandingView extends BaseView {
  constructor(options = {}) {
    const viewModel = options.viewModel || new LandingViewModel();
    super({ ...options, viewModel });
  }

  render() {
    return `
      <div class="landing-container">
        <div class="landing-hero">
          <h1 class="landing-hero__title">
            <span class="highlight">Antigravity</span> MVVM 
          </h1>
          <p class="landing-hero__subtitle">
            El marco de desarrollo más dinámico y premium para equipos escalables.
            Desarrolado con HTML semántico, Vanilla JavaScript y un diseño deslumbrante.
          </p>
          <div class="landing-hero__actions">
            <button id="btn-login" class="btn btn--primary btn--large landing-btn">
              Iniciar Sesión
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <a href="#features" id="btn-features" class="btn btn--secondary btn--large landing-btn">
              Explorar Funciones
            </a>
          </div>
        </div>

        <div id="features" class="landing-features">
          <div class="feature-card">
            <div class="feature-card__icon">💻</div>
            <h3 class="feature-card__title">Arquitectura MVVM</h3>
            <p class="feature-card__desc">Código limpio, modular y completamente separado por capas de responsabilidad.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">⚡</div>
            <h3 class="feature-card__title">Reactivo sin Frameworks</h3>
            <p class="feature-card__desc">Una experiencia veloz y reactiva usando solo Vanilla JS y el EventBus.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">🎨</div>
            <h3 class="feature-card__title">Diseño Premium</h3>
            <p class="feature-card__desc">Aceleración de GPU, glassmorphism, gradientes suaves y animaciones elegantes.</p>
          </div>
        </div>
      </div>
    `;
  }

  _bindViewModel() {
    // Binding si hubiera estado
  }

  _bindEvents() {
    this._addEvent('#btn-login', 'click', () => {
      this._viewModel.goToLogin();
    });

    this._addEvent('#btn-features', 'click', (e) => {
      e.preventDefault();
      const featuresSection = this.$('#features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
