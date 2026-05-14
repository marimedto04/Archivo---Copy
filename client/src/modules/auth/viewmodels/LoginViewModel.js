/**
 * LoginViewModel
 * ---------------
 * Maneja la lógica de presentación del formulario de login.
 *
 * Responsabilidades:
 *   - Estado del formulario (campos, errores, loading)
 *   - Validación de inputs antes de enviar
 *   - Coordinar con AuthService y authStore
 *   - Emitir eventos globales post-login
 */

import { BaseViewModel } from '../../../core/BaseViewModel.js'
import { authService } from '../services/AuthService.js'
import { authStore } from '../store/authStore.js'
import { eventBus } from '../../../shared/utils/eventBus.js'

export class LoginViewModel extends BaseViewModel {
  _initState() {
    this.setState({
      isLoading: false,
      error: null,
      email: '',
      password: '',
      fieldErrors: {},
    })
  }

  // ─── Comandos (acciones que la View puede invocar) ────────────────────────

  /**
   * Actualiza el valor de un campo del formulario.
   * @param {string} field - 'email' | 'password'
   * @param {string} value
   */
  updateField(field, value) {
    this.setState({ [field]: value })

    // Limpiar error del campo al editar
    const fieldErrors = { ...this.getState('fieldErrors') }
    delete fieldErrors[field]
    this.setState({ fieldErrors })
  }

  /**
   * Ejecuta el proceso de login.
   * @returns {Promise<void>}
   */
  async submitLogin() {
    if (!this._validateForm()) return

    this.startLoading()

    try {
      const credentials = {
        email: this.getState('email'),
        password: this.getState('password'),
      }

      const sessionData = await authService.login(credentials)

      // Persistir sesión en el store del módulo
      authStore.setSession(sessionData)

      this.stopLoading()

      // Notificar a otros módulos que el login fue exitoso
      eventBus.emit('auth:loginSuccess', { user: sessionData.user })

    } catch (error) {
      let errorMsg = 'Credenciales incorrectas.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = 'Correo o contraseña inválidos.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Demasiados intentos fallidos. Intenta más tarde.';
      }
      this.setError(errorMsg)
      this.stopLoading()
    }
  }

  /**
   * Ejecuta el login con Google.
   */
  async loginWithGoogle() {
    this.startLoading()
    try {
      const sessionData = await authService.loginWithGoogle();
      authStore.setSession(sessionData);
      this.stopLoading();
      eventBus.emit('auth:loginSuccess', { user: sessionData.user });
    } catch(error) {
      this.setError('Error al iniciar sesión con Google.');
      this.stopLoading();
    }
  }

  // ─── Validación ───────────────────────────────────────────────────────────

  /**
   * Valida los campos del formulario.
   * @returns {boolean}
   */
  _validateForm() {
    const fieldErrors = {}
    const email = this.getState('email')
    const password = this.getState('password')

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldErrors.email = 'Ingresa un email válido.'
    }

    if (!password || password.length < 6) {
      fieldErrors.password = 'La contraseña debe tener al menos 6 caracteres.'
    }

    if (Object.keys(fieldErrors).length > 0) {
      this.setState({ fieldErrors })
      return false
    }

    return true
  }
}
