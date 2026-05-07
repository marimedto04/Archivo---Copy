/**
 * RegisterViewModel
 * ---------------
 * Maneja la lógica de presentación del formulario de registro.
 */

import { BaseViewModel } from '../../../core/BaseViewModel.js'
import { authService } from '../services/AuthService.js'
import { authStore } from '../store/authStore.js'
import { eventBus } from '../../../shared/utils/eventBus.js'
import { httpClient } from '../../../shared/utils/httpClient.js'

export class RegisterViewModel extends BaseViewModel {
  _initState() {
    this.setState({
      isLoading: false,
      error: null,
      email: '',
      password: '',
      name: '',
      character: '',
      grade: '',
      fieldErrors: {},
    })
  }

  updateField(field, value) {
    this.setState({ [field]: value })
    const fieldErrors = { ...this.getState('fieldErrors') }
    delete fieldErrors[field]
    this.setState({ fieldErrors })
  }

  async submitRegister() {
    if (!this._validateForm()) return

    this.startLoading()

    try {
      const credentials = {
        email: this.getState('email'),
        password: this.getState('password'),
      }

      // 1. Registrar usuario
      const sessionData = await authService.register(credentials)

      // Guardar sesión e inyectar token HTTP para la siguiente llamada
      authStore.setSession(sessionData)
      httpClient.setAuthToken(sessionData.token)

      // 2. Actualizar perfil (nombre, personaje, grado)
      const profileData = {
        name: this.getState('name').trim(),
        character: this.getState('character'),
        grade: parseInt(this.getState('grade'), 10)
      }

      const updatedSession = await authService.updateProfile(profileData)
      
      // Actualizar sesión con los datos de perfil
      authStore.setSession(updatedSession)

      this.stopLoading()

      // Emitimos el éxito para ir al dashboard directamente
      eventBus.emit('auth:registerSuccess', { user: updatedSession.user })

    } catch (error) {
      this.setError(error.message || 'Error al crear la cuenta.')
      this.stopLoading()
    }
  }

  _validateForm() {
    const fieldErrors = {}
    const email = this.getState('email')
    const password = this.getState('password')
    const name = this.getState('name')
    const character = this.getState('character')
    const grade = this.getState('grade')

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldErrors.email = 'Ingresa un email válido.'
    }

    if (!password || password.length < 6) {
      fieldErrors.password = 'La contraseña debe tener al menos 6 caracteres.'
    }
    
    if (!name || !name.trim()) {
      fieldErrors.name = 'Por favor ingresa tu nombre.'
    }
    
    if (!character) {
      fieldErrors.character = 'Por favor elige un personaje.'
    }
    
    if (!grade) {
      fieldErrors.grade = 'Por favor selecciona a qué grado perteneces.'
    }

    if (Object.keys(fieldErrors).length > 0) {
      this.setState({ fieldErrors })
      // Mostrar el primer error globalmente si es un error de selección
      if (fieldErrors.character || fieldErrors.grade) {
        this.setError(fieldErrors.character || fieldErrors.grade)
      }
      return false
    }

    this.setError(null)
    return true
  }
}
