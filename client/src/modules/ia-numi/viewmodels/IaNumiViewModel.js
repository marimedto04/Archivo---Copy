import { BaseViewModel } from '../../../core/BaseViewModel.js';
import { IaNumiModel } from '../models/IaNumiModel.js';
import { IaNumiService } from '../services/IaNumiService.js';
import { iaNumiStore } from '../store/iaNumiStore.js';
import { authStore } from '../../auth/store/authStore.js';
import { chatService } from '../../chatbot/services/ChatService.js';
import { chatStore } from '../../chatbot/store/chatStore.js';

export class IaNumiViewModel extends BaseViewModel {
  constructor() {
    const model = new IaNumiModel();
    super({ model });
    this._service = new IaNumiService();
  }

  _initState() {
    this.setState({
      isLoading: false,
      error: null,
      subjects: this._model.get('subjects') || [],
      selectedSubjectId: null, // "matematicas", "sociales", etc.
      isDownloaded: false,
      isDownloadedSociales: false,
      isDownloadedNaturales: false,
      isDownloadedIngles: false,
      isDownloadedEspanol: false,
      question: '',
      suggestedQuestions: [
        '¿Cómo se divide?',
        '¿Cómo se hacen las fracciones?'
      ],
      messages: [] // Historial del chat actual
    });
  }

  onMount() {
    // Escuchar mensajes globales si es necesario
  }

  selectSubject(subjectId) {
    const subjects = this.getState('subjects');
    const subject = subjects.find(s => s.id === subjectId);
    
    if (subject) {
      iaNumiStore.setState({ currentSubject: subject });
      this.setState({ 
        selectedSubjectId: subjectId,
        question: '',
        messages: []
      });

      // Verificar si ya está descargado el contenido para este nivel y materia
      const level = authStore.user.get('level') || 1;
      const backendId = subjectId === 'naturales' ? 'ciencias' : subjectId;
      const fullSubjectId = `${level}-${backendId}`;
      const isDownloaded = chatStore.isDownloaded(fullSubjectId);
      
      this._updateDownloadState(subjectId, isDownloaded);

      if (isDownloaded) {
        this._loadHistory(fullSubjectId);
      }
    }
  }

  _updateDownloadState(subjectId, value) {
    if (subjectId === 'matematicas') this.setState({ isDownloaded: value });
    if (subjectId === 'sociales') this.setState({ isDownloadedSociales: value });
    if (subjectId === 'naturales') this.setState({ isDownloadedNaturales: value });
    if (subjectId === 'ingles') this.setState({ isDownloadedIngles: value });
    if (subjectId === 'espanol') this.setState({ isDownloadedEspanol: value });
  }

  async _handleDownloadGeneric(subjectId) {
    const level = authStore.user.get('level') || 1;
    const backendId = subjectId === 'naturales' ? 'ciencias' : subjectId;
    const fullSubjectId = `${level}-${backendId}`;
    
    this.startLoading();
    try {
      const resp = await chatService.downloadSubjectContent(fullSubjectId);
      const content = resp?.content ?? '';
      chatStore.saveContent(fullSubjectId, content);
      
      this._updateDownloadState(subjectId, true);
      this._loadHistory(fullSubjectId);
    } catch (err) {
      console.error("Error al descargar:", err);
      // Opcional: mostrar error en la UI
    } finally {
      this.stopLoading();
    }
  }

  handleDownload() { this._handleDownloadGeneric('matematicas'); }
  handleDownloadSociales() { this._handleDownloadGeneric('sociales'); }
  handleDownloadNaturales() { this._handleDownloadGeneric('naturales'); }
  handleDownloadIngles() { this._handleDownloadGeneric('ingles'); }
  handleDownloadEspanol() { this._handleDownloadGeneric('espanol'); }

  setQuestion(question) {
    this.setState({ question });
  }

  selectSuggestedQuestion(question) {
    this.setState({ question });
  }

  async onSubmit() {
    const question = this.getState('question').trim();
    if (!question || this.getState('isLoading')) return;
    
    const subjectId = this.getState('selectedSubjectId');
    const level = authStore.user.get('level') || 1;
    const backendId = subjectId === 'naturales' ? 'ciencias' : subjectId;
    const fullSubjectId = `${level}-${backendId}`;

    this.setState({ question: '' });
    this._pushMessage('user', question);
    this.startLoading();

    try {
      const resp = await chatService.askQuestion({
        question,
        subjectId: fullSubjectId,
        level
      });
      const answer = resp?.answer ?? 'Sin respuesta. Intenta de nuevo.';
      this._pushMessage('assistant', answer);
    } catch (err) {
      console.error(err);
      this._pushMessage('error', `⚠️ Hubo un error de conexión.`);
    } finally {
      this.stopLoading();
    }
  }

  _loadHistory(fullSubjectId) {
    const history = chatStore.getHistory(fullSubjectId);
    if (history.length > 0) {
      this.setState({ messages: [...history] });
    } else {
      const subjectId = this.getState('selectedSubjectId');
      const greetingText = subjectId === 'ingles' 
        ? '¡Hello! Soy numi ¿en qué te puedo ayudar hoy?' 
        : '¡Hola! Soy numi ¿en qué te puedo ayudar hoy?';
        
      this.setState({ messages: [] });
      this._pushMessage('assistant', greetingText);
    }
  }

  _pushMessage(role, text) {
    const msg = {
      id: Date.now() + Math.random(),
      role,
      text,
      timestamp: new Date().toISOString(),
    };
    const messages = [...this.getState('messages'), msg];
    this.setState({ messages });
    
    const subjectId = this.getState('selectedSubjectId');
    const level = authStore.user.get('level') || 1;
    const backendId = subjectId === 'naturales' ? 'ciencias' : subjectId;
    const fullSubjectId = `${level}-${backendId}`;
    
    if (subjectId) {
      chatStore.addMessage(fullSubjectId, msg);
    }
  }
}
