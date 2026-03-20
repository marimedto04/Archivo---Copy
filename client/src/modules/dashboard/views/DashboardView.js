/**
 * DashboardView
 * --------------
 * Renderiza el panel principal de la aplicación.
 */

import { BaseView } from '../../../core/BaseView.js'
import { DashboardViewModel } from '../viewmodels/DashboardViewModel.js'

export class DashboardView extends BaseView {
  constructor(options = {}) {
    const viewModel = options.viewModel || new DashboardViewModel()
    super({ ...options, viewModel })
  }

  render() {
    return `
      <div class="dashboard-container">
        <header class="dashboard-header">
          <h1 id="dashboard-title">Dashboard</h1>
          <span id="dashboard-user" class="dashboard-user"></span>
          <button class="btn btn--secondary" id="dashboard-refresh">Actualizar</button>
        </header>

        <div id="dashboard-loading" class="loading" style="display:none;">
          Cargando datos...
        </div>

        <div id="dashboard-error" class="alert alert--error" style="display:none;"></div>

        <section class="dashboard-metrics" id="dashboard-metrics">
          <!-- Las métricas se renderizan dinámicamente -->
        </section>

        <footer class="dashboard-footer">
          Última actualización: <span id="dashboard-last-updated">—</span>
        </footer>
      </div>
    `
  }

  _bindViewModel() {
    this._subscribe('isLoading', isLoading => {
      const loadingEl = this.$('#dashboard-loading')
      if (loadingEl) loadingEl.style.display = isLoading ? 'block' : 'none'
    })

    this._subscribe('error', error => {
      const errorEl = this.$('#dashboard-error')
      if (!errorEl) return
      errorEl.textContent = error || ''
      errorEl.style.display = error ? 'block' : 'none'
    })

    this._subscribe('metrics', metrics => {
      this._renderMetrics(metrics)
    })

    this._subscribe('lastUpdated', date => {
      const el = this.$('#dashboard-last-updated')
      if (el) el.textContent = date ? new Date(date).toLocaleString() : '—'
    })

    this._subscribe('currentUser', user => {
      const el = this.$('#dashboard-user')
      if (el) el.textContent = user ? `Hola, ${user.name}` : ''
    })
  }

  _bindEvents() {
    this._addEvent('#dashboard-refresh', 'click', () => {
      this._viewModel.refresh()
    })
  }

  _renderMetrics(metrics = []) {
    const container = this.$('#dashboard-metrics')
    if (!container) return

    if (!metrics.length) {
      container.innerHTML = '<p class="empty-state">Sin métricas disponibles.</p>'
      return
    }

    container.innerHTML = metrics.map(metric => `
      <div class="metric-card" data-id="${metric.id}">
        <h3 class="metric-card__title">${metric.label}</h3>
        <p class="metric-card__value">${metric.value}</p>
      </div>
    `).join('')
  }
}
