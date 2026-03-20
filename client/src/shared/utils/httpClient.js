/**
 * HttpClient
 * -----------
 * Abstracción sobre fetch para todos los Services del proyecto.
 * Centraliza: baseURL, headers, tokens de autenticación, manejo de errores HTTP.
 *
 * Regla: Los Services SIEMPRE usan HttpClient, nunca fetch directamente.
 * Regla: HttpClient NO contiene lógica de negocio, solo de transporte.
 */

class HttpClient {
  constructor() {
    this._baseUrl = ''
    this._defaultHeaders = {
      'Content-Type': 'application/json',
    }
    this._interceptors = {
      request: [],
      response: [],
    }
  }

  // ─── Configuración ─────────────────────────────────────────────────────────

  /**
   * Configura la URL base de la API.
   * Llamar una vez en la inicialización de la app.
   * @param {string} url
   */
  setBaseUrl(url) {
    this._baseUrl = url
  }

  /**
   * Agrega o actualiza un header global.
   * @param {string} key
   * @param {string} value
   */
  setHeader(key, value) {
    this._defaultHeaders[key] = value
  }

  /**
   * Elimina un header global.
   * @param {string} key
   */
  removeHeader(key) {
    delete this._defaultHeaders[key]
  }

  /**
   * Configura el token de autenticación en el header Authorization.
   * @param {string} token
   */
  setAuthToken(token) {
    this.setHeader('Authorization', `Bearer ${token}`)
  }

  /**
   * Elimina el token de autenticación.
   */
  clearAuthToken() {
    this.removeHeader('Authorization')
  }

  // ─── Interceptores ─────────────────────────────────────────────────────────

  /**
   * Agrega un interceptor de request o response.
   * @param {'request'|'response'} type
   * @param {Function} interceptor
   */
  addInterceptor(type, interceptor) {
    this._interceptors[type].push(interceptor)
  }

  // ─── Métodos HTTP ──────────────────────────────────────────────────────────

  /**
   * @param {string} endpoint
   * @param {object} [options]
   * @returns {Promise<any>}
   */
  get(endpoint, options = {}) {
    return this._request(endpoint, { ...options, method: 'GET' })
  }

  /**
   * @param {string} endpoint
   * @param {object} [body]
   * @param {object} [options]
   * @returns {Promise<any>}
   */
  post(endpoint, body, options = {}) {
    return this._request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) })
  }

  /**
   * @param {string} endpoint
   * @param {object} [body]
   * @param {object} [options]
   * @returns {Promise<any>}
   */
  put(endpoint, body, options = {}) {
    return this._request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) })
  }

  /**
   * @param {string} endpoint
   * @param {object} [body]
   * @param {object} [options]
   * @returns {Promise<any>}
   */
  patch(endpoint, body, options = {}) {
    return this._request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) })
  }

  /**
   * @param {string} endpoint
   * @param {object} [options]
   * @returns {Promise<any>}
   */
  delete(endpoint, options = {}) {
    return this._request(endpoint, { ...options, method: 'DELETE' })
  }

  // ─── Core ──────────────────────────────────────────────────────────────────

  /**
   * Ejecuta la petición HTTP.
   * @param {string} endpoint
   * @param {RequestInit} options
   * @returns {Promise<any>}
   */
  async _request(endpoint, options = {}) {
    let config = {
      ...options,
      headers: {
        ...this._defaultHeaders,
        ...(options.headers || {}),
      },
    }

    // Aplicar interceptores de request
    for (const interceptor of this._interceptors.request) {
      config = await interceptor(config)
    }

    const url = `${this._baseUrl}${endpoint}`

    let response
    try {
      response = await fetch(url, config)
    } catch (networkError) {
      throw new Error(`Error de red: ${networkError.message}`)
    }

    // Aplicar interceptores de response
    for (const interceptor of this._interceptors.response) {
      response = await interceptor(response)
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      const error = new Error(errorBody.message || `HTTP ${response.status}`)
      error.status = response.status
      error.body = errorBody
      throw error
    }

    // Retornar vacío si no hay body (204 No Content, etc.)
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return response.json()
    }

    return response.text()
  }
}

// Singleton compartido entre todos los Services
export const httpClient = new HttpClient()
