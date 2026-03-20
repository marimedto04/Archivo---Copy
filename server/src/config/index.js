/**
 * config/index.js
 * ----------------
 * Configuración centralizada del servidor.
 * Todas las variables de entorno se leen desde aquí.
 * Los módulos NUNCA acceden a process.env directamente.
 */

export const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    isDev: (process.env.NODE_ENV || 'development') === 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  db: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/myapp',
  },
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
  },
}
