import { BaseController } from '../../../../server/src/core/BaseController.js'
import { ChatbotService } from './chatbot.service.js'

const svc = new ChatbotService()

export class ChatbotController extends BaseController {

    getSubjects(req, res) {
        const level = parseInt(req.query.level)
        if (!level || ![1, 2, 3].includes(level))
            return this.badRequest(res, 'El parámetro level debe ser 1, 2 o 3.')
        try {
            return this.ok(res, svc.getSubjectsByLevel(level))
        } catch (e) {
            return e.statusCode === 404 ? this.notFound(res, e.message) : this.serverError(res, e)
        }
    }

    getSubjectContent(req, res) {
        const id = parseInt(req.params.id)
        if (!id) return this.badRequest(res, 'ID inválido.')
        try {
            return this.ok(res, svc.getSubjectContent(id))
        } catch (e) {
            return e.statusCode === 404 ? this.notFound(res, e.message) : this.serverError(res, e)
        }
    }

    async askQuestion(req, res) {
        const { valid, missing } = this.validateRequired(req.body, ['question', 'subjectId', 'level'])
        if (!valid) return this.badRequest(res, `Faltan campos: ${missing.join(', ')}`)
        try {
            const result = await svc.askQuestion({
                question: req.body.question,
                subjectId: parseInt(req.body.subjectId),
                level: parseInt(req.body.level),
            })
            return this.ok(res, result)
        } catch (e) {
            if (e.statusCode === 400) return this.badRequest(res, e.message)
            if (e.statusCode === 404) return this.notFound(res, e.message)
            if (e.message?.includes('GROQ_API_KEY'))
                return res.status(503).json({ success: false, message: e.message })
            return this.serverError(res, e)
        }
    }
}