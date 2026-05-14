import { BaseView } from '../../../core/BaseView.js';
import { IaNumiViewModel } from '../viewmodels/IaNumiViewModel.js';
import { NavComponent } from '../../../shared/components/NavComponent.js';
import { FooterComponent } from '../../home/views/components/FooterComponent.js';
import polloImg from '../../../../assets/styles/images/pollo1.png';
import monoImg from '../../../../assets/styles/images/mono.png';
import descargaImg from '../../../../assets/styles/images/descarga.png';
import descargaSocialesImg from '../../../../assets/styles/images/descarga_ciencias_sociales.png';
import descargaNaturalesImg from '../../../../assets/styles/images/descarga_ciencias_naturales.png';
import descargaInglesImg from '../../../../assets/styles/images/descarga_ciencias_ingles.png';
import descargaEspanolImg from '../../../../assets/styles/images/descarga_ciencias_español.png';

/**
 * IaNumiView
 * ----------
 * Vista principal del módulo IA Numi con grilla de materias y sección de chat.
 */
export class IaNumiView extends BaseView {
  constructor(options = {}) {
    const viewModel = options.viewModel || new IaNumiViewModel();
    super({ ...options, viewModel });
  }

  /**
   * Renderiza el HTML del módulo.
   * @returns {string}
   */
  render() {
    const subjects = this._viewModel.getState('subjects') || [];
    const selectedSubjectId = this._viewModel.getState('selectedSubjectId');
    const isDownloaded = this._viewModel.getState('isDownloaded');
    const isDownloadedSociales = this._viewModel.getState('isDownloadedSociales');
    const isDownloadedNaturales = this._viewModel.getState('isDownloadedNaturales');
    const isDownloadedIngles = this._viewModel.getState('isDownloadedIngles');
    const isDownloadedEspanol = this._viewModel.getState('isDownloadedEspanol');
    const question = this._viewModel.getState('question') || '';
    const suggestedQuestions = this._viewModel.getState('suggestedQuestions') || [];
    const messages = this._viewModel.getState('messages') || [];
    const isLoading = this._viewModel.getState('isLoading');

    // Helper para renderizar los mensajes dentro de la tarjeta
    const renderMsgsHtml = () => {
      return `
        <div class="ia-chat-msgs" style="max-height: 300px; overflow-y: auto; margin-bottom: 15px; padding-right: 10px; display: flex; flex-direction: column; gap: 10px;">
          ${messages.map(m => {
            const isUser = m.role === 'user';
            const isErr = m.role === 'error';
            const bg = isUser ? '#f8fafc' : (isErr ? '#fee2e2' : 'transparent');
            const border = isUser ? '1px solid #e2e8f0' : 'none';
            const color = isUser ? '#334155' : (isErr ? '#dc2626' : '#1e293b');
            const align = isUser ? 'flex-end' : 'flex-start';
            const radius = isUser ? '15px 15px 0 15px' : '0 15px 15px 15px';
            return `
              <div style="display: flex; flex-direction: column; align-items: ${align};">
                <div style="background: ${bg}; color: ${color}; padding: 12px 18px; border-radius: ${radius}; border: ${border}; max-width: 90%; line-height: 1.5; font-size: 1.1em;">
                  ${m.text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                </div>
              </div>
            `;
          }).join('')}
          ${isLoading ? `
             <div style="display: flex; flex-direction: column; align-items: flex-start;">
                <div style="color: #64748b; padding: 10px 15px; font-style: italic;">
                  numi está escribiendo...
                </div>
              </div>
          ` : ''}
        </div>
      `;
    };

    // Organizar en filas de 3 y 2 para la grilla principal
    const rows = [
      subjects.slice(0, 3),
      subjects.slice(3, 5)
    ];

    const rowsHtml = rows.map(row => `
        <div class="ia-numi-grid__row">
          ${row.map(subject => `
            <div class="subject-card" data-id="${subject.id}" style="--subject-color: ${subject.color}">
              <button class="subject-btn" style="background: none; box-shadow: none; padding: 0;">
                <img src="${subject.icon}" alt="${subject.name}" style="width: 100%; height: 100%; object-fit: contain;">
              </button>
              <span class="subject-name">${subject.name}</span>
            </div>
          `).join('')}
        </div>
      `).join('');

    // Sección de Descarga (condicional Matemáticas)
    let downloadHtml = '';
    if (selectedSubjectId === 'matematicas' && !isDownloaded) {
      downloadHtml = `
        <div id="download-section" class="download-section">
          <button class="download-btn" style="background: none; border: none; cursor: pointer; padding: 0; margin-top: 40px;">
            <img src="${descargaImg}" alt="Descargar" style="width: 200px; height: auto;">
          </button>
        </div>
      `;
    }

    // Sección de Descarga (condicional Sociales)
    let downloadSocialesHtml = '';
    if (selectedSubjectId === 'sociales' && !isDownloadedSociales) {
      downloadSocialesHtml = `
        <div id="download-sociales-section" class="download-section">
          <button class="download-sociales-btn" style="background: none; border: none; cursor: pointer; padding: 0; margin-top: 40px;">
            <img src="${descargaSocialesImg}" alt="Descargar Sociales" style="width: 200px; height: auto;">
          </button>
        </div>
      `;
    }

    // Sección de Descarga (condicional Naturales)
    let downloadNaturalesHtml = '';
    if (selectedSubjectId === 'naturales' && !isDownloadedNaturales) {
      downloadNaturalesHtml = `
        <div id="download-naturales-section" class="download-section">
          <button class="download-naturales-btn" style="background: none; border: none; cursor: pointer; padding: 0; margin-top: 40px;">
            <img src="${descargaNaturalesImg}" alt="Descargar Naturales" style="width: 200px; height: auto;">
          </button>
        </div>
      `;
    }

    // Sección de Descarga (condicional Inglés)
    let downloadInglesHtml = '';
    if (selectedSubjectId === 'ingles' && !isDownloadedIngles) {
      downloadInglesHtml = `
        <div id="download-ingles-section" class="download-section">
          <button class="download-ingles-btn" style="background: none; border: none; cursor: pointer; padding: 0; margin-top: 40px;">
            <img src="${descargaInglesImg}" alt="Descargar Inglés" style="width: 200px; height: auto;">
          </button>
        </div>
      `;
    }

    // Sección de Descarga (condicional Español)
    let downloadEspanolHtml = '';
    if (selectedSubjectId === 'espanol' && !isDownloadedEspanol) {
      downloadEspanolHtml = `
        <div id="download-espanol-section" class="download-section">
          <button class="download-espanol-btn" style="background: none; border: none; cursor: pointer; padding: 0; margin-top: 40px;">
            <img src="${descargaEspanolImg}" alt="Descargar Español" style="width: 200px; height: auto;">
          </button>
        </div>
      `;
    }

    // Sección de Matemáticas (condicional)
    let mathCardHtml = '';
    if (selectedSubjectId === 'matematicas' && isDownloaded) {
      const chipsHtml = suggestedQuestions.map(q => `
        <button class="faq-chip">${q}</button>
      `).join('');

      mathCardHtml = `
        <div id="math-section" class="math-content">
          <h1 class="math-title">Matemáticas</h1>
          
          <div class="math-card-wrapper">
            <div class="math-characters">
              <img src="${polloImg}" alt="Pollito" class="char-img char-img--pollo">
              <img src="${monoImg}" alt="Mono" class="char-img char-img--mono">
            </div>
            
            <div class="math-card">
              ${renderMsgsHtml()}
              
              <div class="math-input-container">
                <input type="text" 
                       class="math-input" 
                       placeholder="Escribe tu pregunta aquí..." 
                       value="${question}"
                       ${isLoading ? 'disabled' : ''}>
              </div>
              
              ${messages.length <= 1 ? `
              <span class="faq-label">Preguntas frecuentes</span>
              <div class="faq-chips">
                ${chipsHtml}
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }

    // Sección de Ciencias Sociales (condicional)
    let socialesCardHtml = '';
    if (selectedSubjectId === 'sociales' && isDownloadedSociales) {
      socialesCardHtml = `
        <div id="sociales-section" class="math-content sociales-content">
          <h1 class="math-title">Ciencias Sociales</h1>
          
          <div class="math-card-wrapper">
            <div class="math-characters">
              <img src="${polloImg}" alt="Pollito" class="char-img char-img--pollo">
              <img src="${monoImg}" alt="Mono" class="char-img char-img--mono">
            </div>
            
            <div class="math-card">
              ${renderMsgsHtml()}
              
              <div class="math-input-container">
                <input type="text" 
                       class="math-input" 
                       placeholder="Escribe tu pregunta aquí..." 
                       value="${question}"
                       ${isLoading ? 'disabled' : ''}>
              </div>
              
              ${messages.length <= 1 ? `
              <span class="faq-label">Preguntas frecuentes</span>
              <div class="faq-chips">
                <button class="faq-chip">Departamentos de Colombia</button>
                <button class="faq-chip">Los indígenas</button>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }

    // Sección de Ciencias Naturales (condicional)
    let naturalesCardHtml = '';
    if (selectedSubjectId === 'naturales' && isDownloadedNaturales) {
      naturalesCardHtml = `
        <div id="naturales-section" class="math-content naturales-content">
          <h1 class="math-title">Ciencias Naturales</h1>
          
          <div class="math-card-wrapper">
            <div class="math-characters">
              <img src="${polloImg}" alt="Pollito" class="char-img char-img--pollo">
              <img src="${monoImg}" alt="Mono" class="char-img char-img--mono">
            </div>
            
            <div class="math-card">
              ${renderMsgsHtml()}
              
              <div class="math-input-container">
                <input type="text" 
                       class="math-input" 
                       placeholder="Escribe tu pregunta aquí..." 
                       value="${question}"
                       ${isLoading ? 'disabled' : ''}>
              </div>
              
              ${messages.length <= 1 ? `
              <span class="faq-label">Preguntas frecuentes</span>
              <div class="faq-chips">
                <button class="faq-chip">Estados de la materia</button>
                <button class="faq-chip">Ecosistemas</button>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }

    // Sección de Inglés (condicional)
    let inglesCardHtml = '';
    if (selectedSubjectId === 'ingles' && isDownloadedIngles) {
      inglesCardHtml = `
        <div id="ingles-section" class="math-content ingles-content">
          <h1 class="math-title">Inglés</h1>
          
          <div class="math-card-wrapper">
            <div class="math-characters">
              <img src="${polloImg}" alt="Pollito" class="char-img char-img--pollo">
              <img src="${monoImg}" alt="Mono" class="char-img char-img--mono">
            </div>
            
            <div class="math-card">
              ${renderMsgsHtml()}
              
              <div class="math-input-container">
                <input type="text" 
                       class="math-input" 
                       placeholder="Escribe tu pregunta aquí..." 
                       value="${question}"
                       ${isLoading ? 'disabled' : ''}>
              </div>
              
              ${messages.length <= 1 ? `
              <span class="faq-label">Preguntas frecuentes</span>
              <div class="faq-chips">
                <button class="faq-chip">Verbo to be</button>
                <button class="faq-chip">Have and has</button>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }

    // Sección de Español (condicional)
    let espanolCardHtml = '';
    if (selectedSubjectId === 'espanol' && isDownloadedEspanol) {
      espanolCardHtml = `
        <div id="espanol-section" class="math-content espanol-content">
          <h1 class="math-title">Español</h1>
          
          <div class="math-card-wrapper">
            <div class="math-characters">
              <img src="${polloImg}" alt="Pollito" class="char-img char-img--pollo">
              <img src="${monoImg}" alt="Mono" class="char-img char-img--mono">
            </div>
            
            <div class="math-card">
              ${renderMsgsHtml()}
              
              <div class="math-input-container">
                <input type="text" 
                       class="math-input" 
                       placeholder="Escribe tu pregunta aquí..." 
                       value="${question}"
                       ${isLoading ? 'disabled' : ''}>
              </div>
              
              ${messages.length <= 1 ? `
              <span class="faq-label">Preguntas frecuentes</span>
              <div class="faq-chips">
                <button class="faq-chip">Tipos de textos</button>
                <button class="faq-chip">Signos de puntuación</button>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="ia-numi-layout-wrapper">
        <div class="ia-numi-container">
          ${NavComponent()}
          <main class="ia-numi-content">
            <h1 class="ia-numi-title">Tus materias</h1>
            
            <div class="ia-numi-grid">
              ${rowsHtml}
            </div>

            ${downloadHtml}
            ${downloadSocialesHtml}
            ${downloadNaturalesHtml}
            ${downloadInglesHtml}
            ${downloadEspanolHtml}
            ${mathCardHtml}
            ${socialesCardHtml}
            ${naturalesCardHtml}
            ${inglesCardHtml}
            ${espanolCardHtml}
          </main>
          ${FooterComponent()}
        </div>
      </div>
    `;
  }

  /**
   * Vincula el ViewModel con la vista.
   */
  _bindViewModel() {
    this._subscribe('selectedSubjectId', (id) => {
      this._rerender();
      if (id === 'matematicas' && !this._viewModel.getState('isDownloaded')) {
        setTimeout(() => {
          const section = this.$('#download-section');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    });

    this._subscribe('isDownloaded', (downloaded) => {
      this._rerender();
      if (downloaded) {
        setTimeout(() => {
          const section = this.$('#math-section');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });

    this._subscribe('isDownloadedSociales', (downloaded) => {
      this._rerender();
      if (downloaded) {
        setTimeout(() => {
          const section = this.$('#sociales-section');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });

    this._subscribe('isDownloadedNaturales', (downloaded) => {
      this._rerender();
      if (downloaded) {
        setTimeout(() => {
          const section = this.$('#naturales-section');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });

    this._subscribe('isDownloadedIngles', (downloaded) => {
      this._rerender();
      if (downloaded) {
        setTimeout(() => {
          const section = this.$('#ingles-section');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });

    this._subscribe('isDownloadedEspanol', (downloaded) => {
      this._rerender();
      if (downloaded) {
        setTimeout(() => {
          const section = this.$('#espanol-section');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });

    this._subscribe('question', (value) => {
      const input = this.$('.math-input');
      if (input && input.value !== value) {
        input.value = value;
      }
    });

    this._subscribe('messages', () => {
      this._rerender();
      setTimeout(() => {
        const msgsContainer = this.$('.ia-chat-msgs');
        if (msgsContainer) msgsContainer.scrollTop = msgsContainer.scrollHeight;
      }, 50);
    });

    this._subscribe('isLoading', () => {
      this._rerender();
      setTimeout(() => {
        const msgsContainer = this.$('.ia-chat-msgs');
        if (msgsContainer) msgsContainer.scrollTop = msgsContainer.scrollHeight;
      }, 50);
    });
  }

  _rerender() {
    if (this._container) {
      this._container.innerHTML = this.render();
      this._bindEvents();
    }
  }

  /**
   * Vincula los eventos del DOM.
   */
  _bindEvents() {
    // Eventos de los botones de materia
    const cards = this.$$('.subject-card');
    cards.forEach(card => {
      const id = card.getAttribute('data-id');
      this._addEvent(card, 'click', () => {
        this._viewModel.selectSubject(id);
      });
    });

    // Eventos de la sección de descarga
    const downloadBtn = this.$('.download-btn');
    if (downloadBtn) {
      this._addEvent(downloadBtn, 'click', () => {
        this._viewModel.handleDownload();
      });
    }

    const downloadSocialesBtn = this.$('.download-sociales-btn');
    if (downloadSocialesBtn) {
      this._addEvent(downloadSocialesBtn, 'click', () => {
        this._viewModel.handleDownloadSociales();
      });
    }

    const downloadNaturalesBtn = this.$('.download-naturales-btn');
    if (downloadNaturalesBtn) {
      this._addEvent(downloadNaturalesBtn, 'click', () => {
        this._viewModel.handleDownloadNaturales();
      });
    }

    const downloadInglesBtn = this.$('.download-ingles-btn');
    if (downloadInglesBtn) {
      this._addEvent(downloadInglesBtn, 'click', () => {
        this._viewModel.handleDownloadIngles();
      });
    }

    const downloadEspanolBtn = this.$('.download-espanol-btn');
    if (downloadEspanolBtn) {
      this._addEvent(downloadEspanolBtn, 'click', () => {
        this._viewModel.handleDownloadEspanol();
      });
    }

    // Eventos de la sección de matemáticas
    const input = this.$('.math-input');
    if (input) {
      this._addEvent(input, 'input', (e) => {
        this._viewModel.setQuestion(e.target.value);
      });

      this._addEvent(input, 'keypress', (e) => {
        if (e.key === 'Enter') {
          this._viewModel.onSubmit();
        }
      });
    }

    const chips = this.$$('.faq-chip');
    chips.forEach(chip => {
      this._addEvent(chip, 'click', () => {
        this._viewModel.selectSuggestedQuestion(chip.textContent);
      });
    });
  }
}
