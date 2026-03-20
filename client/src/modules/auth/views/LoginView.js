/**
 * LoginView
 * ----------
 * Renderiza el formulario de login y reacciona a los cambios del LoginViewModel.
 *
 * Regla: NO contiene lógica de negocio.
 * Regla: SOLO se comunica con LoginViewModel.
 */

import { BaseView } from '../../../core/BaseView.js'
import { LoginViewModel } from '../viewmodels/LoginViewModel.js'

export class LoginView extends BaseView {
  constructor(options = {}) {
    const viewModel = options.viewModel || new LoginViewModel()
    super({ ...options, viewModel })
  }

  // ─── Renderizado inicial ──────────────────────────────────────────────────

  render() {
    return `
      <div class="login-container">
        <div class="login-card">
          <h1 class="login-title">Iniciar sesión</h1>

          <div id="login-error" class="alert alert--error" style="display:none;"></div>

          <form id="login-form" novalidate>
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input
                class="form-input"
                type="email"
                id="email"
                name="email"
                placeholder="tu@email.com"
                autocomplete="email"
              />
              <span class="form-error" id="email-error"></span>
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Contraseña</label>
              <input
                class="form-input"
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <span class="form-error" id="password-error"></span>
            </div>

            <button
              class="btn btn--primary btn--full"
              type="submit"
              id="login-submit"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    `
  }

  // ─── Binding del ViewModel ────────────────────────────────────────────────

  _bindViewModel() {
    this._subscribe('isLoading', isLoading => {
      const btn = this.$('#login-submit')
      if (!btn) return
      btn.disabled = isLoading
      btn.textContent = isLoading ? 'Ingresando...' : 'Ingresar'
    })

    this._subscribe('error', error => {
      const errorEl = this.$('#login-error')
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
  }

  // ─── Binding de eventos DOM ───────────────────────────────────────────────

  _bindEvents() {
    this._addEvent('#email', 'input', e => {
      this._viewModel.updateField('email', e.target.value)
    })

    this._addEvent('#password', 'input', e => {
      this._viewModel.updateField('password', e.target.value)
    })

    this._addEvent('#login-form', 'submit', async e => {
      e.preventDefault()
      await this._viewModel.submitLogin()
    })
  }

  // ─── Actualizaciones parciales del DOM ───────────────────────────────────

  _renderFieldErrors(fieldErrors = {}) {
    const fields = ['email', 'password']
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
