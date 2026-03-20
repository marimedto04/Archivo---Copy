/**
 * BaseView
 * ---------
 * Capa de PRESENTACIÓN. Maneja el DOM y los eventos de usuario.
 * Responsabilidades:
 *   - Renderizar HTML dinámico
 *   - Escuchar cambios del ViewModel y actualizar el DOM
 *   - Capturar eventos del usuario y delegarlos al ViewModel
 *   - Gestionar su propio ciclo de vida (mount / destroy)
 *
 * Regla: La View NO contiene lógica de negocio.
 * Regla: La View SOLO se comunica con su ViewModel asignado.
 * Regla: La View NO llama directamente a Services ni Models.
 */

export class BaseView {
  /**
   * @param {object} options
   * @param {string|HTMLElement} options.container - Selector CSS o elemento DOM
   * @param {import('./BaseViewModel').BaseViewModel} options.viewModel
   */
  constructor(options = {}) {
    this._viewModel = options.viewModel || null
    this._container = this._resolveContainer(options.container)
    this._eventHandlers = []
    this._vmSubscriptions = []
    this._isMounted = false
  }

  // ─── Contenedor ───────────────────────────────────────────────────────────

  /**
   * Resuelve el contenedor del DOM (selector o elemento).
   * @param {string|HTMLElement} container
   * @returns {HTMLElement}
   */
  _resolveContainer(container) {
    if (typeof container === 'string') {
      return document.querySelector(container)
    }
    return container || null
  }

  // ─── Ciclo de vida ────────────────────────────────────────────────────────

  /**
   * Monta la View: renderiza el HTML inicial, enlaza el ViewModel y adjunta eventos.
   * @returns {Promise<void>}
   */
  async mount() {
    if (!this._container) {
      console.error(`[BaseView] No se encontró el contenedor para ${this.constructor.name}`)
      return
    }

    this._container.innerHTML = this.render()
    this._bindViewModel()
    this._bindEvents()
    this._isMounted = true

    if (this._viewModel) {
      await this._viewModel.onMount()
    }
  }

  /**
   * Desmonta la View: limpia eventos y suscripciones.
   */
  destroy() {
    // Remover listeners del DOM
    this._eventHandlers.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler)
    })

    // Desuscribirse del ViewModel
    this._vmSubscriptions.forEach(({ key, handler }) => {
      if (this._viewModel) {
        this._viewModel.off(key, handler)
      }
    })

    if (this._viewModel) {
      this._viewModel.onDestroy()
    }

    this._eventHandlers = []
    this._vmSubscriptions = []
    this._isMounted = false
  }

  // ─── Renderizado ──────────────────────────────────────────────────────────

  /**
   * Retorna el HTML de la View como string.
   * DEBE sobreescribirse en cada subclase.
   * @returns {string}
   */
  render() {
    return ''
  }

  /**
   * Actualiza una parte del DOM sin re-renderizar todo.
   * @param {string} selector - Selector CSS dentro del contenedor
   * @param {string} html - Nuevo HTML
   */
  updatePartial(selector, html) {
    const target = this._container.querySelector(selector)
    if (target) target.innerHTML = html
  }

  // ─── Binding del ViewModel ────────────────────────────────────────────────

  /**
   * Enlaza el ViewModel a la View observando cambios de estado.
   * Sobreescribir para definir qué propiedades observar y cómo reaccionar.
   */
  _bindViewModel() {}

  /**
   * Helper para suscribirse al ViewModel y registrar la suscripción.
   * @param {string} key - Clave del estado a observar
   * @param {Function} handler - Función a ejecutar cuando cambia
   */
  _subscribe(key, handler) {
    if (!this._viewModel) return
    this._viewModel.on(key, handler)
    this._vmSubscriptions.push({ key, handler })
  }

  // ─── Binding de eventos DOM ───────────────────────────────────────────────

  /**
   * Adjunta eventos del DOM.
   * Sobreescribir para registrar los event listeners de la View.
   */
  _bindEvents() {}

  /**
   * Helper para adjuntar un evento al DOM y registrarlo para limpieza.
   * @param {string|HTMLElement} selectorOrElement
   * @param {string} event
   * @param {Function} handler
   */
  _addEvent(selectorOrElement, event, handler) {
    let element

    if (typeof selectorOrElement === 'string') {
      element = this._container.querySelector(selectorOrElement)
    } else {
      element = selectorOrElement
    }

    if (!element) {
      console.warn(`[BaseView] No se encontró el elemento: ${selectorOrElement}`)
      return
    }

    element.addEventListener(event, handler)
    this._eventHandlers.push({ element, event, handler })
  }

  // ─── Utilidades ───────────────────────────────────────────────────────────

  /**
   * Busca un elemento dentro del contenedor de esta View.
   * @param {string} selector
   * @returns {HTMLElement|null}
   */
  $(selector) {
    return this._container ? this._container.querySelector(selector) : null
  }

  /**
   * Busca múltiples elementos dentro del contenedor de esta View.
   * @param {string} selector
   * @returns {NodeList}
   */
  $$(selector) {
    return this._container ? this._container.querySelectorAll(selector) : []
  }
}
