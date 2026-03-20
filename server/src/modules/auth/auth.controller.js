/**
 * auth.controller.js
 * -------------------
 * Controlador del módulo de autenticación.
 * Parsea requests, delega al AuthService, formatea respuestas.
 */

import { BaseController } from '../../core/BaseController.js'
import { AuthService } from './auth.service.js'

const authService = new AuthService()

export class AuthController extends BaseController {
  /**
   * POST /auth/login
   */
  async login(req, res) {
    const { valid, missing } = this.validateRequired(req.body, ['email', 'password'])
    if (!valid) {
      return this.badRequest(res, `Campos requeridos faltantes: ${missing.join(', ')}`)
    }

    try {
      const result = await authService.login(req.body)
      return this.ok(res, result, 'Login exitoso.')
    } catch (error) {
      if (error.statusCode === 401) return this.unauthorized(res, error.message)
      return this.serverError(res, error)
    }
  }

  /**
   * POST /auth/register
   */
  async register(req, res) {
    const { valid, missing } = this.validateRequired(req.body, ['name', 'email', 'password'])
    if (!valid) {
      return this.badRequest(res, `Campos requeridos faltantes: ${missing.join(', ')}`)
    }

    try {
      const result = await authService.register(req.body)
      return this.created(res, result)
    } catch (error) {
      if (error.statusCode === 400) return this.badRequest(res, error.message)
      return this.serverError(res, error)
    }
  }

  /**
   * POST /auth/logout
   */
  async logout(req, res) {
    // TODO: Invalidar token en lista negra si se usa JWT
    return this.noContent(res)
  }
}
