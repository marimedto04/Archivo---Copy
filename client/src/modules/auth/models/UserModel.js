/**
 * UserModel
 * ----------
 * Representa la entidad de usuario en el sistema.
 * Solo contiene datos y validaciones de negocio del dominio auth.
 */

import { BaseModel } from '../../../core/BaseModel.js'

export class UserModel extends BaseModel {
  defaults() {
    return {
      id: null,
      email: '',
      name: '',
      role: 'guest',
      isAuthenticated: false,
      createdAt: null,
    }
  }

  validate() {
    const errors = []

    if (!this.get('email') || !this._isValidEmail(this.get('email'))) {
      errors.push('El email no es válido.')
    }

    if (!this.get('name') || this.get('name').trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres.')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  // ─── Computed properties ──────────────────────────────────────────────────

  get fullInfo() {
    return `${this.get('name')} <${this.get('email')}>`
  }

  get isAdmin() {
    return this.get('role') === 'admin'
  }

  // ─── Helpers privados ─────────────────────────────────────────────────────

  _isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}
