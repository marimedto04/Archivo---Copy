/**
 * SubjectSelectorViewModel.js
 * ----------------------------
 * Actualizado para manejar la respuesta de Firebase Cloud Functions.
 *
 * La respuesta de Genkit tiene el formato:
 *   { subjects: [...] }   (después de que callFunction extrae result)
 */

import { BaseViewModel } from '../../../core/BaseViewModel.js'
import { chatService } from '../services/ChatService.js'
import { chatStore } from '../store/chatStore.js'
import { eventBus } from '../../../shared/utils/eventBus.js'

export class SubjectSelectorViewModel extends BaseViewModel {

    _initState() {
        this.setState({
            isLoading: false,
            error: null,
            selectedLevel: null,
            subjects: [],
            downloadingId: null,
        })
    }

    async selectLevel(level) {
        this.setState({ selectedLevel: level, subjects: [], error: null })
        this.startLoading()

        try {
            // ChatService ya extrae result de la respuesta de Firebase,
            // así que resp tiene directamente: { subjects: [...] }
            const resp = await chatService.getSubjectsByLevel(level)
            const rawList = resp?.subjects ?? []

            const subjects = rawList.map(s => ({
                ...s,
                isDownloaded: chatStore.isDownloaded(s.id),
            }))

            this.setState({ subjects, isLoading: false })
        } catch (err) {
            this.setError(err.message || 'Error al cargar las materias.')
        }
    }

    async downloadContent(subjectId) {
        this.setState({ downloadingId: subjectId })

        try {
            // chatbotGetContent devuelve: { subject, content }
            const resp = await chatService.downloadSubjectContent(subjectId)
            const content = resp?.content ?? ''

            chatStore.saveContent(subjectId, content)

            const subjects = this.getState('subjects').map(s =>
                s.id === subjectId ? { ...s, isDownloaded: true } : s
            )

            this.setState({ subjects, downloadingId: null })
        } catch (err) {
            this.setState({ downloadingId: null })
            this.setError(err.message || 'Error al descargar.')
        }
    }

    selectSubject(subject) {
        eventBus.emit('chatbot:subjectSelected', {
            subject,
            level: this.getState('selectedLevel'),
        })
    }
}