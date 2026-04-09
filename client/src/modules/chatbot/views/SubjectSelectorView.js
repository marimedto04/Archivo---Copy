import { BaseView } from '../../../core/BaseView.js'
import { SubjectSelectorViewModel } from '../viewmodels/SubjectSelectorViewModel.js'

const LEVELS = [
    { level: 1, label: 'Nivel 1', grades: 'Grados 1° y 2°', emoji: '🌱' },
    { level: 2, label: 'Nivel 2', grades: 'Grados 3° y 4°', emoji: '⭐' },
    { level: 3, label: 'Nivel 3', grades: 'Grado 5°', emoji: '🏆' },
]

export class SubjectSelectorView extends BaseView {
    constructor(opts = {}) {
        super({ ...opts, viewModel: opts.viewModel || new SubjectSelectorViewModel() })
    }

    render() {
        return `
      <div class="chatbot-selector">
        <div class="chatbot-selector__header">
          <h2 class="chatbot-selector__title">NUMI</h2>
          <p class="chatbot-selector__subtitle">Elige tu nivel y materia para empezar</p>
        </div>

        <div class="chatbot-selector__levels" id="level-buttons">
          ${LEVELS.map(l => `
            <button class="chatbot-level-btn" data-level="${l.level}">
              <span class="chatbot-level-btn__emoji">${l.emoji}</span>
              <span class="chatbot-level-btn__label">${l.label}</span>
              <span class="chatbot-level-btn__grades">${l.grades}</span>
            </button>
          `).join('')}
        </div>

        <div id="sel-error"   class="alert alert--error" style="display:none;"></div>
        <div id="sel-loading" class="loading"            style="display:none;">Cargando materias...</div>
        <div id="sel-list"    class="chatbot-subjects"></div>
      </div>
    `
    }

    _bindViewModel() {
        this._subscribe('isLoading', v => {
            const el = this.$('#sel-loading'); if (el) el.style.display = v ? 'block' : 'none'
        })
        this._subscribe('error', v => {
            const el = this.$('#sel-error'); if (!el) return
            el.textContent = v || ''; el.style.display = v ? 'block' : 'none'
        })
        this._subscribe('selectedLevel', level => {
            this.$$('.chatbot-level-btn').forEach(b =>
                b.classList.toggle('chatbot-level-btn--active', Number(b.dataset.level) === level)
            )
        })
        this._subscribe('subjects', list => this._renderList(list))
    }

    _bindEvents() {
        this._addEvent('#level-buttons', 'click', e => {
            const b = e.target.closest('[data-level]')
            if (b) this._viewModel.selectLevel(Number(b.dataset.level))
        })
        this._addEvent('#sel-list', 'click', e => {
            const dl = e.target.closest('[data-download]')
            const chat = e.target.closest('[data-chat]')
            if (dl) this._viewModel.downloadContent(Number(dl.dataset.download))
            if (chat) {
                const s = this._viewModel.getState('subjects').find(x => x.id === Number(chat.dataset.chat))
                if (s) this._viewModel.selectSubject(s)
            }
        })
    }

    _renderList(subjects) {
        const el = this.$('#sel-list')
        if (!el) return
        if (!subjects?.length) { el.innerHTML = ''; return }
        el.innerHTML = subjects.map(s => `
      <div class="chatbot-subject-card" style="border-left:4px solid ${s.color || '#4CAF50'}">
        <div class="chatbot-subject-card__info">
          <div>
            <p class="chatbot-subject-card__name">${s.name}</p>
            <p class="chatbot-subject-card__desc">${s.description || ''}</p>
          </div>
        </div>
        ${s.isDownloaded ? `<span class="chatbot-subject-card__badge">✅ Descargado</span>` : ''}
        <div class="chatbot-subject-card__actions">
          <button class="btn btn--secondary chatbot-subject-card__btn-dl" data-download="${s.id}">
            ${s.isDownloaded ? '🔄 Actualizar' : '⬇️ Descargar'}
          </button>
          <button class="btn btn--primary chatbot-subject-card__btn-chat" data-chat="${s.id}"
            ${!s.isDownloaded ? 'disabled title="Descarga primero"' : ''}>
            🤖 Chatear
          </button>
        </div>
      </div>
    `).join('')
    }
}