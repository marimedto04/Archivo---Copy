import { httpClient } from '../../../shared/utils/httpClient.js'

class ChatService {
    getSubjectsByLevel(level) {
        return httpClient.get(`/chatbot/subjects?level=${level}`)
    }
    downloadSubjectContent(subjectId) {
        return httpClient.get(`/chatbot/subjects/${subjectId}/content`)
    }
    askQuestion(payload) {
        return httpClient.post('/chatbot/ask', payload)
    }
}

export const chatService = new ChatService()