/**
 * dashboardStore
 * ---------------
 * Estado compartido del módulo DASHBOARD.
 * Otros módulos pueden leer de este store pero no escribir.
 */

import { DashboardModel } from '../models/DashboardModel.js'

class DashboardStore {
  constructor() {
    this._dashboard = new DashboardModel()
    this._listeners = []
  }

  get dashboard() {
    return this._dashboard
  }

  /**
   * Actualiza los datos del dashboard.
   * @param {object} data
   */
  updateData(data) {
    this._dashboard.set(data)
    this._notifyListeners()
  }

  subscribe(callback) {
    this._listeners.push(callback)
    return () => {
      this._listeners = this._listeners.filter(fn => fn !== callback)
    }
  }

  _notifyListeners() {
    this._listeners.forEach(fn => fn(this._dashboard.toJSON()))
  }
}

export const dashboardStore = new DashboardStore()
