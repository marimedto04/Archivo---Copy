import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '.env') })
import express from 'express'
import cors from 'cors'
import { config } from './src/config/index.js'
import { errorHandler } from './src/middleware/errorHandler.js'
import authRoutes from './src/modules/auth/auth.routes.js'
import chatbotRoutes from '../client/src/modules/chatbot/chatbot.routes.js'

const app = express()

app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRoutes)
app.use('/chatbot', chatbotRoutes)

app.use(errorHandler)

app.listen(config.server.port, () => {
  console.log(`✅ Servidor en http://localhost:${config.server.port}`)
  console.log(`   Entorno: ${config.server.env}`)
})

export default app