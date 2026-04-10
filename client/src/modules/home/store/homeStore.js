/**
 * HomeStore - Singleton para el estado del módulo Home
 */
class HomeStore {
  constructor() {
    this.data = null;
  }
}

export const homeStore = new HomeStore();
