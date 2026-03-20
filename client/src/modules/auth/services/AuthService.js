/**
 * AuthService
 * ------------
 * Capa de acceso a datos del módulo AUTH.
 * Solo realiza operaciones de red relacionadas con autenticación.
 *
 * Regla: AuthService retorna datos crudos (objetos JS). No modifica Models ni Stores.
 * Regla: El ViewModel es quien decide qué hacer con lo que retorna el Service.
 */

import { httpClient } from '../../../shared/utils/httpClient.js'

class AuthService {
  /**
   * Autentica al usuario con email y password.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ user: object, token: string }>}
   */
  async login(credentials) {
    return httpClient.post('/auth/login', credentials)
  }

  /**
   * Registra un nuevo usuario.
   * @param {{ name: string, email: string, password: string }} userData
   * @returns {Promise<{ user: object, token: string }>}
   */
  async register(userData) {
    return httpClient.post('/auth/register', userData)
  }

  /**
   * Cierra la sesión del usuario actual en el servidor.
   * @returns {Promise<void>}
   */
  async logout() {
    return httpClient.post('/auth/logout', {})
  }

  /**
   * Solicita un reset de contraseña por email.
   * @param {string} email
   * @returns {Promise<void>}
   */
  async requestPasswordReset(email) {
    return httpClient.post('/auth/password-reset', { email })
  }

  /**
   * Valida el token JWT actual con el servidor.
   * @returns {Promise<{ user: object }>}
   */
  async validateToken() {
    return httpClient.get('/auth/validate')
  }
}

export const authService = new AuthService()
