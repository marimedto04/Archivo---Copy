/**
 * BaseService
 * ------------
 * Clase base para todos los servicios del servidor.
 * Responsabilidades:
 *   - Contener la lógica de negocio del dominio
 *   - Orquestar operaciones entre repositorios / modelos de BD
 *   - Lanzar errores descriptivos que el Controller captura
 *
 * Regla: Los Services NO acceden directamente a req/res de Express.
 * Regla: Los Services NO devuelven respuestas HTTP, devuelven datos o lanzan errores.
 */

export class BaseService {
  /**
   * Lanza un error de negocio con código HTTP asociado.
   * @param {string} message
   * @param {number} [statusCode]
   */
  throwError(message, statusCode = 400) {
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
  }

  /**
   * Lanza un error 404.
   * @param {string} [resource]
   */
  throwNotFound(resource = 'Recurso') {
    this.throwError(`${resource} no encontrado.`, 404)
  }

  /**
   * Lanza un error 401.
   * @param {string} [message]
   */
  throwUnauthorized(message = 'No autorizado.') {
    this.throwError(message, 401)
  }

  /**
   * Lanza un error 403.
   * @param {string} [message]
   */
  throwForbidden(message = 'Acceso denegado.') {
    this.throwError(message, 403)
  }
}
