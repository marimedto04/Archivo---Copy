/**
 * auth.routes.js
 * ---------------
 * Definición de rutas del módulo auth.
 * Las rutas solo enlazan endpoints con métodos del Controller.
 */

import { Router } from 'express'
import { AuthController } from './auth.controller.js'

const router = Router()
const authController = new AuthController()

// Bind de los métodos para mantener el contexto de `this`
router.post('/login', (req, res) => authController.login(req, res))
router.post('/register', (req, res) => authController.register(req, res))
router.post('/logout', (req, res) => authController.logout(req, res))

export default router
