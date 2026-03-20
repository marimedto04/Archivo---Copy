/**
 * errorHandler.js
 * ----------------
 * Middleware global de manejo de errores de Express.
 * Captura cualquier error no manejado y retorna una respuesta JSON consistente.
 */

/**
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function errorHandler(err, req, res, next) {
  console.error(`[ErrorHandler] ${req.method} ${req.path}`, err.message)

  const statusCode = err.statusCode || 500
  const message = statusCode < 500 ? err.message : 'Error interno del servidor.'

  return res.status(statusCode).json({
    success: false,
    message,
  })
}
