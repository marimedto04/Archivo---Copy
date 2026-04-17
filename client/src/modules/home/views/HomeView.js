import { BaseView } from '../../../core/BaseView.js';
import { HomeViewModel } from '../viewmodels/HomeViewModel.js';
import pollo1 from '../../../../assets/styles/images/pollo1.png';
import mono from '../../../../assets/styles/images/mono.png';
import { NavComponent } from '../../../shared/components/NavComponent.js';


export class HomeView extends BaseView {
  constructor(options = {}) {
    const viewModel = options.viewModel || new HomeViewModel();
    super({ ...options, viewModel });
  }

  render() {
    return `
      <div class="home-container" style="">
        ${NavComponent()}

        <header class="home-header">
            <h1>
                <span class="text-white">¡Hola!</span><br>
                Bienvenido a <span class="text-white">numi</span>
            </h1>
        </header>

        <section class="login-wrapper">
            <div class="wave-top">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path fill="#ffffff" d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,37.3C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path></svg>
            </div>
            <div class="login-container">
                <h2>Inicia sesión</h2>
                <form>
                    <input type="email" placeholder="Email">
                    <input type="password" placeholder="Contraseña">
                    <button type="button" class="btn-orange" id="btn-login" style="margin-top: 15px;">Iniciar sesión</button>
                </form>
            </div>
        </section>
        <section class="onda">
        </section>
      

        <section class="signup-wrapper">
            <h2>Crea una cuenta</h2>

           

            <h3>¿Cuál es tu nombre?</h3>
            <div class="input-center">
                <input type="text" placeholder="Nombre" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border);">
            </div>
            <h3>Elije tu personaje</h3>
            <div class="character-selection">
                <div class="char-circle bg-purple">
                    <img src="${pollo1}" alt="Pollo">
                </div>
                <div class="char-circle bg-green">
                    <img src="${mono}" alt="Mono">
                </div>
            </div>

             <h3>A que grado perteneces</h3>
            <div class="grade-selection">
                <button type="button" class="grade-btn bg-green">3º</button>
                <button type="button" class="grade-btn bg-purple">4º</button>
                <button type="button" class="grade-btn bg-red">5º</button>
            </div>
            <div class="landscape"></div>
        </section>
      </div>
    `;
  }

  _bindViewModel() { }

  _bindEvents() {
    this._addEvent('#btn-login', 'click', (e) => {
      e.preventDefault();
      // Simular auth login success para navegar a la segunda pantalla
      import('../../../shared/utils/eventBus.js').then(({ eventBus }) => {
        eventBus.emit('auth:loginSuccess', { user: 'Test' });
      });
    });
  }
}
