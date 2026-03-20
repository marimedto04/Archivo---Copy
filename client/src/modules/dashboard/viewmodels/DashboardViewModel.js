/**
 * DashboardViewModel
 * -------------------
 * Lógica de presentación del Dashboard.
 * Escucha eventos globales (ej: login) para reaccionar entre módulos.
 */

import { BaseViewModel } from '../../../core/BaseViewModel.js'
import { dashboardService } from '../services/DashboardService.js'
import { dashboardStore } from '../store/dashboardStore.js'
import { authStore } from '../../auth/store/authStore.js'
import { eventBus } from '../../../shared/utils/eventBus.js'

export class DashboardViewModel extends BaseViewModel {
  _initState() {
    this.setState({
      isLoading: false,
      error: null,
      metrics: [],
      title: 'Dashboard',
      lastUpdated: null,
      currentUser: null,
    })
  }

  async onMount() {
    // Leer usuario autenticado desde el store de auth (solo lectura)
    const user = authStore.user.toJSON()
    this.setState({ currentUser: user })

    // Escuchar si el usuario hace logout desde otro módulo
    this._logoutUnsub = eventBus.on('auth:logout', () => {
      this.setState({ metrics: [], currentUser: null })
    })

    await this.loadData()
  }

  onDestroy() {
    if (this._logoutUnsub) this._logoutUnsub()
    super.onDestroy()
  }

  // ─── Comandos ─────────────────────────────────────────────────────────────

  /**
   * Carga los datos del dashboard desde el servidor.
   */
  async loadData() {
    this.startLoading()
    try {
      const data = await dashboardService.fetchDashboardData()
      dashboardStore.updateData(data)
      this.setState({
        metrics: data.metrics,
        lastUpdated: data.lastUpdated,
        isLoading: false,
      })
    } catch (error) {
      this.setError(error.message)
    }
  }

  /**
   * Refresca los datos.
   */
  async refresh() {
    await this.loadData()
  }
}
