/**
 * tests/client/LoginViewModel.test.js
 * -------------------------------------
 * Prueba unitaria del LoginViewModel.
 * Ejemplo de cómo testear ViewModels sin depender del DOM.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock del authService para no hacer llamadas HTTP reales
vi.mock('../../client/src/modules/auth/services/AuthService.js', () => ({
  authService: {
    login: vi.fn(),
  },
}))

vi.mock('../../client/src/modules/auth/store/authStore.js', () => ({
  authStore: {
    setSession: vi.fn(),
  },
}))

vi.mock('../../client/src/shared/utils/eventBus.js', () => ({
  eventBus: {
    emit: vi.fn(),
  },
}))

vi.mock('../../client/src/shared/utils/httpClient.js', () => ({
  httpClient: {
    setAuthToken: vi.fn(),
  },
}))

import { LoginViewModel } from '../../client/src/modules/auth/viewmodels/LoginViewModel.js'
import { authService } from '../../client/src/modules/auth/services/AuthService.js'
import { eventBus } from '../../client/src/shared/utils/eventBus.js'

describe('LoginViewModel', () => {
  let vm

  beforeEach(() => {
    vm = new LoginViewModel()
    vi.clearAllMocks()
  })

  it('inicia con estado limpio', () => {
    expect(vm.getState('isLoading')).toBe(false)
    expect(vm.getState('error')).toBeNull()
    expect(vm.getState('email')).toBe('')
    expect(vm.getState('password')).toBe('')
  })

  it('actualiza el campo email correctamente', () => {
    vm.updateField('email', 'test@email.com')
    expect(vm.getState('email')).toBe('test@email.com')
  })

  it('no envía el formulario con email inválido', async () => {
    vm.updateField('email', 'no-es-email')
    vm.updateField('password', '123456')

    await vm.submitLogin()

    expect(authService.login).not.toHaveBeenCalled()
    expect(vm.getState('fieldErrors').email).toBeTruthy()
  })

  it('no envía el formulario con contraseña corta', async () => {
    vm.updateField('email', 'test@email.com')
    vm.updateField('password', '123')

    await vm.submitLogin()

    expect(authService.login).not.toHaveBeenCalled()
    expect(vm.getState('fieldErrors').password).toBeTruthy()
  })

  it('emite auth:loginSuccess al hacer login exitoso', async () => {
    authService.login.mockResolvedValue({
      user: { id: '1', name: 'Diego', email: 'diego@test.com' },
      token: 'mock-token',
    })

    vm.updateField('email', 'diego@test.com')
    vm.updateField('password', 'password123')

    await vm.submitLogin()

    expect(eventBus.emit).toHaveBeenCalledWith('auth:loginSuccess', expect.any(Object))
    expect(vm.getState('isLoading')).toBe(false)
    expect(vm.getState('error')).toBeNull()
  })

  it('registra el error cuando el login falla', async () => {
    authService.login.mockRejectedValue(new Error('Credenciales incorrectas.'))

    vm.updateField('email', 'diego@test.com')
    vm.updateField('password', 'wrongpass')

    await vm.submitLogin()

    expect(vm.getState('error')).toBe('Credenciales incorrectas.')
    expect(vm.getState('isLoading')).toBe(false)
  })
})
