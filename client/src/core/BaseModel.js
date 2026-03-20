/**
 * BaseModel
 * ----------
 * Capa de DATOS. Representa la entidad de negocio.
 * Responsabilidades:
 *   - Almacenar datos crudos
 *   - Validar integridad de los datos
 *   - Emitir cambios cuando sus propiedades se actualizan
 *   - Serializar / deserializar (toJSON, fromJSON)
 *
 * Regla: El Model NO conoce ni la View ni el ViewModel.
 * Regla: El Model NO hace llamadas HTTP directamente (eso es rol de los Services).
 */

export class BaseModel {
  /**
   * @param {object} initialData - Datos iniciales del modelo
   */
  constructor(initialData = {}) {
    this._data = {}
    this._listeners = {}
    this._init(initialData)
  }

  // ─── Inicialización ───────────────────────────────────────────────────────

  /**
   * Carga los datos iniciales.
   * @param {object} data
   */
  _init(data) {
    const defaults = this.defaults()
    Object.assign(this._data, defaults, data)
  }

  /**
   * Define los valores por defecto del modelo.
   * Cada subclase DEBE sobreescribir este método.
   * @returns {object}
   */
  defaults() {
    return {}
  }

  // ─── Getters / Setters reactivos ──────────────────────────────────────────

  /**
   * Obtiene el valor de una propiedad.
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    return this._data[key]
  }

  /**
   * Actualiza una o varias propiedades y notifica a los suscriptores.
   * @param {string|object} keyOrObject - Clave o mapa de clave-valor
   * @param {*} [value]
   */
  set(keyOrObject, value) {
    if (typeof keyOrObject === 'object') {
      Object.entries(keyOrObject).forEach(([k, v]) => {
        this._data[k] = v
        this._notify(k, v)
      })
    } else {
      this._data[keyOrObject] = value
      this._notify(keyOrObject, value)
    }
  }

  // ─── Validación ───────────────────────────────────────────────────────────

  /**
   * Valida el estado del modelo.
   * Sobreescribir en subclases para agregar reglas de negocio.
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validate() {
    return { valid: true, errors: [] }
  }

  // ─── Serialización ────────────────────────────────────────────────────────

  /**
   * Retorna un objeto plano con los datos del modelo.
   * @returns {object}
   */
  toJSON() {
    return { ...this._data }
  }

  /**
   * Carga datos desde un objeto plano.
   * @param {object} data
   */
  fromJSON(data) {
    this.set(data)
  }

  // ─── Sistema de eventos ───────────────────────────────────────────────────

  /**
   * Suscribe una función a los cambios de una propiedad.
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
   * Desuscribe una función de los cambios de una propiedad.
   * @param {string} key
   * @param {Function} callback
   */
  off(key, callback) {
    if (!this._listeners[key]) return
    this._listeners[key] = this._listeners[key].filter(fn => fn !== callback)
  }

  /**
   * Notifica a los suscriptores de un cambio.
   * @param {string} key
   * @param {*} value
   */
  _notify(key, value) {
    const handlers = this._listeners[key] || []
    handlers.forEach(fn => fn(value, key))

    // Notificar también a los suscriptores del evento genérico "*"
    const wildcard = this._listeners['*'] || []
    wildcard.forEach(fn => fn(value, key))
  }
}
