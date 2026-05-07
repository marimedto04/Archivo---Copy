import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { config } from './src/config/index.js'
import { errorHandler } from './src/middleware/errorHandler.js'
import './src/database/db.js'
import authRoutes from './src/modules/auth/auth.routes.js'

const app = express()
app.use(cors({ origin: config.cors.allowedOrigins, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/auth', authRoutes)
app.use(errorHandler)
app.listen(config.server.port, () => {
  console.log(`✅ Servidor en http://localhost:${config.server.port}`)
})
export default app