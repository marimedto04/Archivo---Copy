/**
 * EventBus (Bus de eventos global)
 * ----------------------------------
 * Permite la comunicación desacoplada ENTRE módulos distintos.
 *
 * USO CORRECTO:
 *   - Comunicar eventos entre módulos diferentes (ej: auth → dashboard)
 *   - Notificaciones globales (ej: sesión expirada, cambio de idioma)
 *
 * USO INCORRECTO:
 *   - Comunicación DENTRO del mismo módulo (usar ViewModel state para eso)
 *   - Reemplazar el binding View ↔ ViewModel (usar _subscribe() de BaseView)
 *
 * Convención de nombres de eventos:
 *   [modulo]:[accion]
 *   Ejemplos: "auth:loginSuccess", "auth:logout", "dashboard:dataLoaded"
 */

class EventBus {
  constructor() {
    this._events = {}
  }

  /**
   * Suscribe un handler a un evento.
   * @param {string} event - Nombre del evento (ej: "auth:loginSuccess")
   * @param {Function} handler
   * @returns {Function} Función para desuscribirse
   */
  on(event, handler) {
    if (!this._events[event]) {
      this._events[event] = []
    }
    this._events[event].push(handler)

    // Retorna función de cleanup
    return () => this.off(event, handler)
  }

  /**
   * Suscribe un handler que se ejecuta solo UNA vez.
   * @param {string} event
   * @param {Function} handler
   */
  once(event, handler) {
    const wrapper = (...args) => {
      handler(...args)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }

  /**
   * Desuscribe un handler de un evento.
   * @param {string} event
   * @param {Function} handler
   */
  off(event, handler) {
    if (!this._events[event]) return
    this._events[event] = this._events[event].filter(fn => fn !== handler)
  }

  /**
   * Emite un evento con datos opcionales.
   * @param {string} event
   * @param {*} [payload]
   */
  emit(event, payload) {
    const handlers = this._events[event] || []
    handlers.forEach(fn => fn(payload))
  }

  /**
   * Elimina todos los handlers de un evento.
   * @param {string} event
   */
  clear(event) {
    delete this._events[event]
  }

  /**
   * Elimina TODOS los handlers de TODOS los eventos.
   * Usar solo en pruebas o en unmount de la aplicación completa.
   */
  clearAll() {
    this._events = {}
  }
}

// Singleton compartido entre todos los módulos
export const eventBus = new EventBus()
