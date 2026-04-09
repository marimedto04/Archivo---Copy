import { BaseViewModel } from '../../../core/BaseViewModel.js'
import { chatService } from '../services/ChatService.js'
import { chatStore } from '../store/chatStore.js'
import { eventBus } from '../../../shared/utils/eventBus.js'

const LEVEL_LABELS = { 1: 'Grados 1° y 2°', 2: 'Grados 3° y 4°', 3: 'Grado 5°' }

export class ChatViewModel extends BaseViewModel {
    constructor(opts = {}) {
        super(opts)
        this._subject = opts.subject || null
        this._level = opts.level || null
    }

    _initState() {
        this.setState({
            isLoading: false,
            error: null,
            messages: [],
            inputText: '',
            subject: null,
            isOnline: navigator.onLine,
        })
    }

    async onMount() {
        if (!this._subject) return
        this.setState({ subject: this._subject })

        const history = chatStore.getHistory(this._subject.id)
        if (history.length > 0) {
            this.setState({ messages: [...history] })
        } else {
            this._push('assistant', '¡Hola! Soy numi ¿en qué te puedo ayudar hoy?')
        }

        this._onOnline = () => this.setState({ isOnline: true })
        this._onOffline = () => this.setState({ isOnline: false })
        window.addEventListener('online', this._onOnline)
        window.addEventListener('offline', this._onOffline)
    }

    onDestroy() {
        window.removeEventListener('online', this._onOnline)
        window.removeEventListener('offline', this._onOffline)
        super.onDestroy()
    }

    updateInput(text) { this.setState({ inputText: text }) }

    async sendMessage() {
        const q = this.getState('inputText').trim()
        if (!q || this.getState('isLoading')) return

        this.setState({ inputText: '' })
        this._push('user', q)
        this.startLoading()

        try {
            const resp = await chatService.askQuestion({
                question: q,
                subjectId: this._subject.id,
                level: this._level,
            })
            // BaseController envuelve en data, extraer el answer
            const answer = resp?.data?.answer ?? resp?.answer ?? 'Sin respuesta.'
            this._push('assistant', answer)
        } catch (err) {
            this._push('error', err.message || '¿Tienes conexión a internet? 📶')
        } finally {
            this.stopLoading()
        }
    }

    goBack() { eventBus.emit('chatbot:back') }

    clearChat() {
        chatStore.clearHistory(this._subject.id)
        this.setState({ messages: [] })
        this._push('assistant', `Chat reiniciado. ¡Listo para responder sobre **${this._subject.name}**! 😊`)
    }

    _push(role, text) {
        const msg = { id: Date.now() + Math.random(), role, text, timestamp: new Date().toISOString() }
        const messages = [...this.getState('messages'), msg]
        this.setState({ messages })
        if (this._subject) chatStore.addMessage(this._subject.id, msg)
    }
}