import { BaseView } from '../../../core/BaseView.js'
import { ChatViewModel } from '../viewmodels/ChatViewModel.js'

const SUGGESTIONS = {
    espanol: ['¿Qué son las vocales?', '¿Qué es una oración?', '¿Qué tipos de texto existen?'],
    matematicas: ['¿Cómo se hace una suma?', '¿Qué es una fracción?', '¿Cómo calculo el perímetro?'],
    ciencias: ['¿Qué son los cinco sentidos?', '¿Qué es un ecosistema?', '¿Cómo funciona el ciclo del agua?'],
    sociales: ['¿Qué es la familia?', '¿Cuáles son las regiones de Colombia?', '¿Cuándo fue la independencia?'],
    ingles: ['¿Cómo se dice hola en inglés?', '¿Cuáles son los colores en inglés?', '¿Cómo son los días de la semana?'],
}

export class ChatView extends BaseView {
    constructor(opts = {}) {
        super({ ...opts, viewModel: new ChatViewModel({ subject: opts.subject, level: opts.level }) })
        this._subject = opts.subject
    }

    render() {
        const s = this._subject || {}
        return `
      <div class="chatbot-chat">
        <header class="chatbot-chat__header">
          <button id="btn-back"  class="chatbot-chat__back  btn btn--secondary">← Volver</button>
          <div class="chatbot-chat__subject-info">
            <div>
              <p class="chatbot-chat__subject-name">${s.name || 'Materia'}</p>
              <p class="chatbot-chat__subject-level">IA Educativa</p>
            </div>
          </div>
          <div id="chat-status" class="chatbot-chat__status" style="color:#16a34a;">●</div>
          <button id="btn-clear" class="chatbot-chat__clear btn btn--secondary" title="Limpiar chat">🗑️</button>
        </header>

        <div id="offline-banner" class="chatbot-chat__offline" style="display:none;">
          📵 Sin internet — numi necesita conexión para responder
        </div>

        <div id="chat-msgs" class="chatbot-chat__messages"></div>

        <div id="chat-sugg" class="chatbot-chat__suggestions">
          <p class="chatbot-chat__suggestions-label">💡 Prueba preguntando:</p>
          <div id="sugg-grid" class="chatbot-chat__suggestions-grid"></div>
        </div>

        <div id="chat-typing" class="chatbot-chat__typing" style="display:none;">
          <span class="chatbot-chat__typing-avatar">🤖</span>
          <div class="chatbot-chat__typing-dots"><span></span><span></span><span></span></div>
        </div>

        <div class="chatbot-chat__input-area">
          <textarea
            id="chat-input" class="chatbot-chat__input form-input"
            placeholder="Pregúntame sobre ${s.name || 'esta materia'}..."
            rows="1" autocomplete="off"
          ></textarea>
          <button id="btn-send" class="chatbot-chat__send btn btn--primary" disabled>➤</button>
        </div>
      </div>
    `
    }

    _bindViewModel() {
        this._subscribe('messages', msgs => {
            this._renderMsgs(msgs)
            const haUser = msgs.some(m => m.role === 'user')
            const sugg = this.$('#chat-sugg')
            if (sugg) sugg.style.display = haUser ? 'none' : 'block'
        })

        this._subscribe('isLoading', v => {
            const t = this.$('#chat-typing'), s = this.$('#btn-send')
            if (t) t.style.display = v ? 'flex' : 'none'
            if (s) s.disabled = v || !this._viewModel.getState('inputText').trim()
            this._scrollDown()
        })

        this._subscribe('inputText', v => {
            const s = this.$('#btn-send')
            if (s) s.disabled = !v.trim() || this._viewModel.getState('isLoading')
        })

        this._subscribe('isOnline', v => {
            const b = this.$('#offline-banner'), st = this.$('#chat-status')
            if (b) b.style.display = v ? 'none' : 'block'
            if (st) st.style.color = v ? '#16a34a' : '#dc2626'
        })

        this._renderSugg()
    }

    _bindEvents() {
        this._addEvent('#btn-back', 'click', () => this._viewModel.goBack())
        this._addEvent('#btn-clear', 'click', () => {
            if (confirm('¿Limpiar el historial?')) this._viewModel.clearChat()
        })
        this._addEvent('#chat-input', 'input', e => {
            this._viewModel.updateInput(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
        })
        this._addEvent('#chat-input', 'keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._viewModel.sendMessage() }
        })
        this._addEvent('#btn-send', 'click', () => this._viewModel.sendMessage())
        this._addEvent('#sugg-grid', 'click', e => {
            const b = e.target.closest('[data-s]')
            if (!b) return
            this._viewModel.updateInput(b.dataset.s)
            const inp = this.$('#chat-input')
            if (inp) { inp.value = b.dataset.s; inp.focus() }
        })
    }

    _renderMsgs(msgs) {
        const area = this.$('#chat-msgs')
        if (!area) return
        area.innerHTML = msgs.map(m => {
            const user = m.role === 'user'
            const err = m.role === 'error'
            const cls = user ? 'chatbot-chat__bubble--user' : err ? 'chatbot-chat__bubble--error' : 'chatbot-chat__bubble--bot'
            return `
        <div class="chatbot-chat__message chatbot-chat__message--${m.role}">
          ${!user ? `<span class="chatbot-chat__avatar">🤖</span>` : ''}
          <div class="chatbot-chat__bubble ${cls}">${this._fmt(m.text)}</div>
          ${user ? `<span class="chatbot-chat__avatar">🧒</span>` : ''}
        </div>`
        }).join('')
        this._scrollDown()
    }

    _renderSugg() {
        const g = this.$('#sugg-grid')
        if (!g || !this._subject) return
        const list = SUGGESTIONS[this._subject.slug] || SUGGESTIONS.espanol
        g.innerHTML = list.map(s =>
            `<button class="chatbot-chat__suggestion-btn" data-s="${s}">${s}</button>`
        ).join('')
    }

    _scrollDown() {
        const a = this.$('#chat-msgs')
        if (a) setTimeout(() => { a.scrollTop = a.scrollHeight }, 50)
    }

    _fmt(t) {
        return t
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
    }
}