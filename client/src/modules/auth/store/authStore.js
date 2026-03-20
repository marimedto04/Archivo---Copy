/**
 * authStore
 * ----------
 * Estado compartido del módulo AUTH.
 * Este store es la ÚNICA fuente de verdad para el estado de autenticación.
 *
 * Regla: Solo los ViewModels del módulo auth modifican este store.
 * Regla: Otros módulos pueden LEER de este store pero NO escribir en él.
 * Regla: Para notificar a otros módulos, usar eventBus (no exportar el store completo).
 */

import { UserModel } from '../models/UserModel.js'

class AuthStore {
  constructor() {
    this._user = new UserModel()
    this._token = null
    this._listeners = []
  }

  // ─── Getters ──────────────────────────────────────────────────────────────

  get user() {
    return this._user
  }

  get token() {
    return this._token
  }

  get isAuthenticated() {
    return this._user.get('isAuthenticated') && this._token !== null
  }

  // ─── Mutaciones (solo desde ViewModels del módulo auth) ───────────────────

  /**
   * Persiste la sesión del usuario autenticado.
   * @param {{ user: object, token: string }} sessionData
   */
  setSession(sessionData) {
    this._token = sessionData.token
    this._user.fromJSON({ ...sessionData.user, isAuthenticated: true })
    this._persist()
    this._notifyListeners()
  }

  /**
   * Limpia la sesión actual.
   */
  clearSession() {
    this._token = null
    this._user = new UserModel()
    this._clearPersisted()
    this._notifyListeners()
  }

  // ─── Persistencia ─────────────────────────────────────────────────────────

  /**
   * Restaura la sesión desde sessionStorage.
   */
  restore() {
    try {
      const raw = sessionStorage.getItem('auth_session')
      if (!raw) return

      const data = JSON.parse(raw)
      this.setSession(data)
    } catch {
      this.clearSession()
    }
  }

  _persist() {
    sessionStorage.setItem('auth_session', JSON.stringify({
      token: this._token,
      user: this._user.toJSON(),
    }))
  }

  _clearPersisted() {
    sessionStorage.removeItem('auth_session')
  }

  // ─── Suscriptores ─────────────────────────────────────────────────────────

  /**
   * Permite a otros módulos reaccionar a cambios de sesión.
   * @param {Function} callback
   * @returns {Function} Función de cleanup
   */
  subscribe(callback) {
    this._listeners.push(callback)
    return () => {
      this._listeners = this._listeners.filter(fn => fn !== callback)
    }
  }

  _notifyListeners() {
    this._listeners.forEach(fn => fn({
      isAuthenticated: this.isAuthenticated,
      user: this._user.toJSON(),
    }))
  }
}

// Singleton del módulo auth
export const authStore = new AuthStore()
