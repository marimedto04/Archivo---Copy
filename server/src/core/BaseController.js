/**
 * BaseController
 * ---------------
 * Clase base para todos los controladores del servidor.
 * Responsabilidades:
 *   - Parsear request y delegar al Service correspondiente
 *   - Formatear la respuesta HTTP (éxito y error)
 *   - NO contener lógica de negocio (eso va en los Services)
 *
 * Convención de nombres de métodos:
 *   GET    /resource       → index(req, res)
 *   GET    /resource/:id   → show(req, res)
 *   POST   /resource       → create(req, res)
 *   PUT    /resource/:id   → update(req, res)
 *   DELETE /resource/:id   → destroy(req, res)
 */

export class BaseController {
  // ─── Respuestas de éxito ──────────────────────────────────────────────────

  /**
   * Responde con 200 OK.
   * @param {import('express').Response} res
   * @param {*} data
   * @param {string} [message]
   */
  ok(res, data, message = 'OK') {
    return res.status(200).json({ success: true, message, data })
  }

  /**
   * Responde con 201 Created.
   * @param {import('express').Response} res
   * @param {*} data
   */
  created(res, data) {
    return res.status(201).json({ success: true, message: 'Creado exitosamente.', data })
  }

  /**
   * Responde con 204 No Content.
   * @param {import('express').Response} res
   */
  noContent(res) {
    return res.status(204).send()
  }

  // ─── Respuestas de error ──────────────────────────────────────────────────

  /**
   * Responde con 400 Bad Request.
   * @param {import('express').Response} res
   * @param {string} message
   * @param {object} [errors]
   */
  badRequest(res, message = 'Solicitud inválida.', errors = null) {
    return res.status(400).json({ success: false, message, errors })
  }

  /**
   * Responde con 401 Unauthorized.
   * @param {import('express').Response} res
   * @param {string} [message]
   */
  unauthorized(res, message = 'No autorizado.') {
    return res.status(401).json({ success: false, message })
  }

  /**
   * Responde con 403 Forbidden.
   * @param {import('express').Response} res
   * @param {string} [message]
   */
  forbidden(res, message = 'Acceso denegado.') {
    return res.status(403).json({ success: false, message })
  }

  /**
   * Responde con 404 Not Found.
   * @param {import('express').Response} res
   * @param {string} [message]
   */
  notFound(res, message = 'Recurso no encontrado.') {
    return res.status(404).json({ success: false, message })
  }

  /**
   * Responde con 500 Internal Server Error.
   * @param {import('express').Response} res
   * @param {Error|string} error
   */
  serverError(res, error) {
    const message = error instanceof Error ? error.message : error
    console.error('[ServerError]', error)
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' })
  }

  // ─── Helper de validación ─────────────────────────────────────────────────

  /**
   * Valida que los campos requeridos estén presentes en el body.
   * @param {object} body
   * @param {string[]} requiredFields
   * @returns {{ valid: boolean, missing: string[] }}
   */
  validateRequired(body, requiredFields) {
    const missing = requiredFields.filter(field => {
      return body[field] === undefined || body[field] === null || body[field] === ''
    })
    return { valid: missing.length === 0, missing }
  }
}
