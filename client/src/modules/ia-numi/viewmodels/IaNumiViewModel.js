import { BaseViewModel } from '../../../core/BaseViewModel.js';
import { IaNumiModel } from '../models/IaNumiModel.js';
import { IaNumiService } from '../services/IaNumiService.js';
import { iaNumiStore } from '../store/iaNumiStore.js';
import { eventBus } from '../../../shared/utils/eventBus.js';

/**
 * IaNumiViewModel
 * ---------------
 * Lógica de presentación para la pantalla principal de IA Numi.
 */
export class IaNumiViewModel extends BaseViewModel {
  constructor() {
    const model = new IaNumiModel();
    super({ model });
    this._service = new IaNumiService();
  }

  /**
   * Define el estado inicial.
   */
  _initState() {
    this.setState({
      isLoading: false,
      error: null,
      subjects: this._model.get('subjects') || [],
      selectedSubjectId: null,
      isDownloaded: false,
      isDownloadedSociales: false,
      isDownloadedNaturales: false,
      isDownloadedIngles: false,
      isDownloadedEspanol: false,
      question: '',
      suggestedQuestions: [
        '¿Cómo se divide?',
        '¿Cómo se hacen las fracciones?'
      ]
    });
  }

  // ... (onMount stays same)

  /**
   * Maneja la selección de una materia.
   * @param {string} subjectId 
   */
  selectSubject(subjectId) {
    const subjects = this.getState('subjects');
    const subject = subjects.find(s => s.id === subjectId);
    
    if (subject) {
      console.log(`IA Numi: Materia seleccionada -> ${subject.name}`);
      iaNumiStore.setState({ currentSubject: subject });
      this.setState({ 
        selectedSubjectId: subjectId,
        isDownloaded: false,
        isDownloadedSociales: false,
        isDownloadedNaturales: false,
        isDownloadedIngles: false,
        isDownloadedEspanol: false
      });
    }
  }

  handleDownload() {
    this.setState({ isDownloaded: true });
  }

  handleDownloadSociales() {
    this.setState({ isDownloadedSociales: true });
  }

  handleDownloadNaturales() {
    this.setState({ isDownloadedNaturales: true });
  }

  handleDownloadIngles() {
    this.setState({ isDownloadedIngles: true });
  }

  handleDownloadEspanol() {
    this.setState({ isDownloadedEspanol: true });
  }

  setQuestion(question) {
    this.setState({ question });
  }

  selectSuggestedQuestion(question) {
    this.setState({ question });
  }

  onSubmit() {
    const question = this.getState('question');
    if (!question.trim()) return;
    console.log(`IA Numi Matemáticas - Pregunta enviada: ${question}`);
  }
}
