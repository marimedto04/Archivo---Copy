/**
 * BaseViewModel
 * --------------
 * Capa de LÓGICA DE PRESENTACIÓN. Es el puente entre el Model y la View.
 * Responsabilidades:
 *   - Mantener el estado de la UI
 *   - Exponer comandos que la View puede invocar
 *   - Transformar datos del Model para consumo de la View
 *   - Coordinar llamadas a los Services
 *   - Gestionar el estado del módulo (loading, error, success)
 *
 * Regla: El ViewModel NO manipula el DOM directamente.
 * Regla: El ViewModel NO importa clases de View.
 * Regla: El ViewModel puede importar Models y Services.
 */

export class BaseViewModel {
  /**
   * @param {object} [options]
   * @param {import('./BaseModel').BaseModel} [options.model]
   */
  constructor(options = {}) {
    this._state = {}
    this._listeners = {}
    this._model = options.model || null
    this._isLoading = false
    this._error = null

    this._initState()
  }

  // ─── Inicialización ───────────────────────────────────────────────────────

  /**
   * Define el estado inicial del ViewModel.
   * Sobreescribir en subclases.
   */
  _initState() {
    this.setState({
      isLoading: false,
      error: null,
    })
  }

  // ─── Estado reactivo ──────────────────────────────────────────────────────

  /**
   * Obtiene un valor del estado.
   * @param {string} key
   * @returns {*}
   */
  getState(key) {
    return this._state[key]
  }

  /**
   * Actualiza el estado y notifica a los suscriptores.
   * @param {object} partialState - Fragmento del nuevo estado
   */
  setState(partialState) {
    const prevState = { ...this._state }
    Object.assign(this._state, partialState)

    Object.keys(partialState).forEach(key => {
      if (prevState[key] !== this._state[key]) {
        this._notify(key, this._state[key])
      }
    })

    this._notify('*', this._state)
  }

  // ─── Helpers de estado UI ─────────────────────────────────────────────────

  /**
   * Marca el inicio de una operación asíncrona.
   */
  startLoading() {
    this.setState({ isLoading: true, error: null })
  }

  /**
   * Marca el fin de una operación asíncrona.
   */
  stopLoading() {
    this.setState({ isLoading: false })
  }

  /**
   * Registra un error y detiene el loading.
   * @param {string|Error} error
   */
  setError(error) {
    const message = error instanceof Error ? error.message : error
    this.setState({ isLoading: false, error: message })
  }

  /**
   * Limpia el error actual.
   */
  clearError() {
    this.setState({ error: null })
  }

  // ─── Ciclo de vida ────────────────────────────────────────────────────────

  /**
   * Se ejecuta cuando la View es montada. Sobreescribir para inicializar datos.
   * @returns {Promise<void>}
   */
  async onMount() {}

  /**
   * Se ejecuta cuando la View es desmontada. Sobreescribir para limpiar recursos.
   */
  onDestroy() {
    this._listeners = {}
  }

  // ─── Sistema de eventos ───────────────────────────────────────────────────

  /**
   * Suscribe una función a los cambios de una propiedad del estado.
   * @param {string} key
   * @param {Function} callback
   */
  on(key, callback) {
    if (!this._listeners[key]) {
      this._listeners[key] = []
    }
    this._listeners[key].push(callback)
  }

  /**
   * Desuscribe una función.
   * @param {string} key
   * @param {Function} callback
   */
  off(key, callback) {
    if (!this._listeners[key]) return
    this._listeners[key] = this._listeners[key].filter(fn => fn !== callback)
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  _notify(key, value) {
    const handlers = this._listeners[key] || []
    handlers.forEach(fn => fn(value))
  }
}
