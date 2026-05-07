import { BaseView } from '../../../core/BaseView.js'
import { RegisterViewModel } from '../viewmodels/RegisterViewModel.js'
import pollo1 from '../../../../assets/styles/images/pollo1.png';
import mono from '../../../../assets/styles/images/mono.png';

export class RegisterView extends BaseView {
  constructor(options = {}) {
    const viewModel = options.viewModel || new RegisterViewModel()
    super({ ...options, viewModel })
  }

  render() {
    return `
      <div class="login-container">
        <section class="signup-wrapper" style="margin-top: 20px;">
          <h2>Crea una cuenta</h2>

          <div id="register-error" class="alert alert--error" style="display:none; color: red;"></div>

          <form id="register-form" novalidate>
            <div class="form-group" style="margin-bottom: 10px;">
              <input class="form-input" type="email" id="email" name="email" placeholder="Email" autocomplete="email" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border);" />
              <span class="form-error" id="email-error"></span>
            </div>

            <div class="form-group" style="margin-bottom: 10px;">
              <input class="form-input" type="password" id="password" name="password" placeholder="Contraseña" autocomplete="new-password" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border);" />
              <span class="form-error" id="password-error"></span>
            </div>

            <h3 style="margin-top: 20px;">¿Cuál es tu nombre?</h3>
            <div class="input-center form-group">
                <input id="name" type="text" placeholder="Nombre" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border);">
                <span class="form-error" id="name-error"></span>
            </div>

            <h3>Elije tu personaje</h3>
            <div class="character-selection">
                <div class="char-circle bg-purple" data-character="pollo">
                    <img src="${pollo1}" alt="Pollo">
                </div>
                <div class="char-circle bg-green" data-character="mono">
                    <img src="${mono}" alt="Mono">
                </div>
            </div>

            <h3>A qué grado perteneces</h3>
            <div class="grade-selection">
                <button type="button" class="grade-btn bg-green" data-grade="3">3º</button>
                <button type="button" class="grade-btn bg-purple" data-grade="4">4º</button>
                <button type="button" class="grade-btn bg-red" data-grade="5">5º</button>
            </div>

            <button type="submit" id="register-submit" class="btn-orange" style="margin-top: 20px; width: 100%;">
              Crear cuenta
            </button>
          </form>
          
          <div style="margin-top: 15px; text-align: center;">
            <a href="/login" data-link>¿Ya tienes cuenta? Inicia sesión aquí</a>
          </div>
        </section>
      </div>
    `
  }

  _bindViewModel() {
    this._subscribe('isLoading', isLoading => {
      const btn = this.$('#register-submit')
      if (!btn) return
      btn.disabled = isLoading
      btn.textContent = isLoading ? 'Creando cuenta...' : 'Crear cuenta'
    })

    this._subscribe('error', error => {
      const errorEl = this.$('#register-error')
      if (!errorEl) return
      if (error) {
        errorEl.textContent = error
        errorEl.style.display = 'block'
      } else {
        errorEl.style.display = 'none'
      }
    })

    this._subscribe('fieldErrors', fieldErrors => {
      this._renderFieldErrors(fieldErrors)
    })

    this._subscribe('character', character => {
      this.$$('.char-circle').forEach(el => {
        el.style.border = el.getAttribute('data-character') === character ? '4px solid #FF9800' : 'none';
      });
    })

    this._subscribe('grade', grade => {
      this.$$('.grade-btn').forEach(el => {
        el.style.opacity = el.getAttribute('data-grade') === grade ? '1' : '0.6';
      });
    })
  }

  _bindEvents() {
    this._addEvent('#email', 'input', e => {
      this._viewModel.updateField('email', e.target.value)
    })

    this._addEvent('#password', 'input', e => {
      this._viewModel.updateField('password', e.target.value)
    })

    this._addEvent('#name', 'input', e => {
      this._viewModel.updateField('name', e.target.value)
    })

    this._addEvent('.char-circle', 'click', (e) => {
      const character = e.currentTarget.getAttribute('data-character');
      this._viewModel.updateField('character', character);
    }, true);

    this._addEvent('.grade-btn', 'click', (e) => {
      const grade = e.target.getAttribute('data-grade');
      this._viewModel.updateField('grade', grade);
    }, true);

    this._addEvent('#register-form', 'submit', async e => {
      e.preventDefault()
      await this._viewModel.submitRegister()
    })
  }

  _renderFieldErrors(fieldErrors = {}) {
    const fields = ['email', 'password', 'name']
    fields.forEach(field => {
      const errorEl = this.$(`#${field}-error`)
      const inputEl = this.$(`#${field}`)
      if (!errorEl || !inputEl) return

      const message = fieldErrors[field] || ''
      errorEl.textContent = message
      inputEl.classList.toggle('form-input--error', !!message)
    })
  }
}
