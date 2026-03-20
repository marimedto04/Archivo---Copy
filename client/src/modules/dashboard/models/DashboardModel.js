/**
 * DashboardModel
 * ---------------
 * Representa los datos agregados del dashboard.
 */

import { BaseModel } from '../../../core/BaseModel.js'

export class DashboardModel extends BaseModel {
  defaults() {
    return {
      title: 'Dashboard',
      metrics: [],
      lastUpdated: null,
    }
  }

  validate() {
    const errors = []
    if (!Array.isArray(this.get('metrics'))) {
      errors.push('Las métricas deben ser un arreglo.')
    }
    return { valid: errors.length === 0, errors }
  }

  /**
   * Retorna el total de métricas disponibles.
   * @returns {number}
   */
  get metricsCount() {
    return (this.get('metrics') || []).length
  }
}
