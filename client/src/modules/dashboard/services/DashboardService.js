/**
 * DashboardService
 * -----------------
 * Acceso a datos del módulo DASHBOARD.
 */

import { httpClient } from '../../../shared/utils/httpClient.js'

class DashboardService {
  /**
   * Obtiene los datos principales del dashboard.
   * @returns {Promise<{ metrics: object[], lastUpdated: string }>}
   */
  async fetchDashboardData() {
    return httpClient.get('/dashboard')
  }

  /**
   * Obtiene una métrica específica por ID.
   * @param {string} metricId
   * @returns {Promise<object>}
   */
  async fetchMetric(metricId) {
    return httpClient.get(`/dashboard/metrics/${metricId}`)
  }
}

export const dashboardService = new DashboardService()
