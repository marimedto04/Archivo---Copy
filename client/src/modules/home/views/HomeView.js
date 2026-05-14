import { BaseView } from '../../../core/BaseView.js';
import { HomeViewModel } from '../viewmodels/HomeViewModel.js';
import pollo1 from '../../../../assets/styles/images/pollo1.png';
import mono from '../../../../assets/styles/images/mono.png';
import { NavComponent } from '../../../shared/components/NavComponent.js';
import { FooterComponent } from './components/FooterComponent.js';


export class HomeView extends BaseView {
  constructor(options = {}) {
    const viewModel = options.viewModel || new HomeViewModel();
    super({ ...options, viewModel });
  }

  render() {
    return `
      <div class="home-container">
        <div class="home-center-content">
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
            <div class="home-login-container">
                <img src="${pollo1}" class="pollo-icon" alt="Pollo">
                <h2>Inicia sesión</h2>
                <form id="home-login-form" novalidate>
                    <input type="email" id="home-login-email" placeholder="Email">
                    <input type="password" id="home-login-password" placeholder="Contraseña">
                    <button type="submit" class="btn-orange" id="btn-login" style="margin-top: 15px;">Iniciar sesión</button>
                    <div id="home-login-error" style="color: red; margin-top: 10px;"></div>
                </form>
            </div>
        </section>
        <section class="onda">
        </section>
      

        <section class="signup-wrapper">
            <h2>Crea una cuenta</h2>

           

            <h3>¿Cuál es tu nombre?</h3>
<<<<<<< HEAD
            <div class="input-center" style="display: flex; flex-direction: column; gap: 15px;">
                <input type="text" id="home-reg-name" placeholder="Nombre" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border);">
                <input type="email" id="home-reg-email" placeholder="Correo electrónico" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border);">
                <input type="password" id="home-reg-password" placeholder="Contraseña" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border);">
=======
            <div class="input-center" style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 0 auto;">
                <input type="text" placeholder="Nombre" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border); box-sizing: border-box;">
                <input type="email" placeholder="Correo" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border); box-sizing: border-box;">
>>>>>>> 2aa3d6082f78e743bd76e050a38a5ad94b5c1cbe
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
<<<<<<< HEAD
            <div style="text-align: center; margin-top: 20px; position: relative; z-index: 10;">
                <button type="button" class="btn-orange" id="btn-register" style="margin-top: 15px;">Crear cuenta</button>
                <div id="home-reg-error" style="color: red; margin-top: 10px;"></div>
=======
            <div style="text-align: center; margin-top: 30px; position: relative; z-index: 10;">
                <button type="button" class="btn-orange" style="padding: 10px 30px; font-size: 14px; border: none; cursor: pointer;">Iniciar sesión</button>
>>>>>>> 2aa3d6082f78e743bd76e050a38a5ad94b5c1cbe
            </div>
            <div class="landscape"></div>
        </section>
        ${FooterComponent()}
        </div>
      </div>
    `;
  }

  _bindViewModel() { }

  _bindEvents() {
    let selectedCharacter = '';
    let selectedGrade = 0;

    const charCircles = this.$$('.char-circle');
    charCircles.forEach(circle => {
      circle.addEventListener('click', (e) => {
        charCircles.forEach(c => c.style.border = 'none');
        e.currentTarget.style.border = '3px solid #ff7b00';
        e.currentTarget.style.borderRadius = '50%';
        selectedCharacter = e.currentTarget.querySelector('img').alt;
      });
    });

    const gradeBtns = this.$$('.grade-btn');
    gradeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        gradeBtns.forEach(b => b.style.border = 'none');
        e.currentTarget.style.border = '3px solid #000';
        selectedGrade = parseInt(e.currentTarget.textContent);
      });
    });

    const loginHandler = (e) => {
      e.preventDefault();
      const emailEl = document.getElementById('home-login-email');
      const passwordEl = document.getElementById('home-login-password');
      const el = document.getElementById('home-login-error');
      
      const email = emailEl ? emailEl.value : '';
      const password = passwordEl ? passwordEl.value : '';
      
      if (email && password) {
        if (el) {
          el.style.color = 'blue';
          el.textContent = 'Conectando con Firebase...';
        }
        this._viewModel.submitLogin(email, password);
      } else {
        if (el) {
          el.style.color = 'red';
          el.textContent = 'Por favor completa todos los campos.';
        }
      }
    };

    const loginForm = document.getElementById('home-login-form');
    if (loginForm) {
      // Usar addEventListener es más seguro que onsubmit
      loginForm.addEventListener('submit', loginHandler);
    }

    this._addEvent('#btn-register', 'click', (e) => {
      e.preventDefault();
      const name = document.getElementById('home-reg-name').value;
      const email = document.getElementById('home-reg-email').value;
      const password = document.getElementById('home-reg-password').value;
      
      console.log('Botón registrar clickeado', { name, email, selectedCharacter, selectedGrade });
      
      if (name && email && password && selectedCharacter && selectedGrade) {
        this._viewModel.submitRegister(name, email, password, selectedCharacter, selectedGrade);
      } else {
        console.warn('Validación fallida: faltan campos o personaje/grado no seleccionados.');
        document.getElementById('home-reg-error').textContent = 'Por favor completa todos los campos y selecciona personaje y grado.';
      }
    });
  }
}
