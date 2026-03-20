/**
 * auth.js (middleware)
 * ---------------------
 * Middleware de autenticación JWT para rutas protegidas.
 * Agrega el usuario decodificado en req.user si el token es válido.
 */

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // TODO: Verificar JWT real con jsonwebtoken
    // const payload = jwt.verify(token, process.env.JWT_SECRET)
    // req.user = payload

    // Stub temporal
    req.user = { id: 'mock-user', role: 'user' }
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado.' })
  }
}

/**
 * Middleware de autorización por rol.
 * @param {...string} roles - Roles permitidos
 * @returns {Function}
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'No autenticado.' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Acceso denegado.' })
    }
    next()
  }
}
