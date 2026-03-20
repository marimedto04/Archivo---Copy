/**
 * auth.service.js
 * ----------------
 * Lógica de negocio del módulo de autenticación.
 */

import { BaseService } from '../../core/BaseService.js'

// ⚠️  USUARIOS DE PRUEBA — eliminar cuando se conecte la base de datos real
const DUMMY_USERS = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@test.com',
    passwordHash: 'admin123',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Diego',
    email: 'diego@test.com',
    passwordHash: 'diego123',
    role: 'user',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

export class AuthService extends BaseService {
  /**
   * Autentica a un usuario con sus credenciales.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ user: object, token: string }>}
   */
  async login(credentials) {
    const { email, password } = credentials

    // TODO: Reemplazar con consulta real a la base de datos
    const user = await this._findUserByEmail(email)

    if (!user) {
      this.throwUnauthorized('Credenciales incorrectas.')
    }

    const isValid = await this._verifyPassword(password, user.passwordHash)
    if (!isValid) {
      this.throwUnauthorized('Credenciales incorrectas.')
    }

    const token = this._generateToken(user)

    return {
      user: this._sanitizeUser(user),
      token,
    }
  }

  /**
   * Registra un nuevo usuario.
   * @param {{ name: string, email: string, password: string }} userData
   * @returns {Promise<{ user: object, token: string }>}
   */
  async register(userData) {
    const { name, email, password } = userData

    const existing = await this._findUserByEmail(email)
    if (existing) {
      this.throwError('Ya existe una cuenta con ese email.')
    }

    // TODO: Implementar hash de contraseña con bcrypt
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString(),
    }

    const token = this._generateToken(newUser)

    return {
      user: this._sanitizeUser(newUser),
      token,
    }
  }

  // ─── Métodos privados ─────────────────────────────────────────────────────

  /**
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  async _findUserByEmail(email) {
    // ⚠️  STUB TEMPORAL — reemplazar con consulta real a la DB
    return DUMMY_USERS.find(u => u.email === email) || null
  }

  /**
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  async _verifyPassword(password, hash) {
    // ⚠️  STUB TEMPORAL — reemplazar con bcrypt.compare(password, hash)
    return password === hash
  }

  /**
   * @param {object} user
   * @returns {string}
   */
  _generateToken(user) {
    // TODO: Implementar con jsonwebtoken
    return `mock-token-${user.id}`
  }

  /**
   * Elimina campos sensibles antes de enviar el usuario al cliente.
   * @param {object} user
   * @returns {object}
   */
  _sanitizeUser(user) {
    const { passwordHash, ...safeUser } = user
    return safeUser
  }
}
