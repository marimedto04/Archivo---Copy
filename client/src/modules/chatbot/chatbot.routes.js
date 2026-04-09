import { Router } from 'express'
import { ChatbotController } from './chatbot.controller.js'

const router = Router()
const ctrl = new ChatbotController()

router.get('/subjects', (req, res) => ctrl.getSubjects(req, res))
router.get('/subjects/:id/content', (req, res) => ctrl.getSubjectContent(req, res))
router.post('/ask', (req, res) => ctrl.askQuestion(req, res))

export default router