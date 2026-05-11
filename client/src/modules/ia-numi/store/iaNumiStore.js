/**
 * iaNumiStore
 * -----------
 * Almacén de estado para el módulo IA Numi.
 * Sigue el patrón Singleton.
 */
class IaNumiStore {
  constructor() {
    this._state = {
      currentSubject: null,
      history: [],
      isProcessing: false
    };
    this._listeners = [];
  }

  /**
   * Retorna una copia del estado actual.
   * @returns {object}
   */
  getState() {
    return { ...this._state };
  }

  /**
   * Actualiza el estado y notifica a los suscriptores.
   * @param {object} newState 
   */
  setState(newState) {
    this._state = { ...this._state, ...newState };
    this._notify();
  }

  /**
   * Suscribe un callback a los cambios de estado.
   * @param {Function} callback 
   * @returns {Function} Función para desuscribirse
   */
  subscribe(callback) {
    this._listeners.push(callback);
    return () => {
      this._listeners = this._listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notifica a todos los suscriptores.
   */
  _notify() {
    this._listeners.forEach(l => l(this._state));
  }
}

// Exportar como Singleton
export const iaNumiStore = new IaNumiStore();
