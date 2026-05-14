import { BaseViewModel } from '../../../core/BaseViewModel.js';
import { HomeModel } from '../models/HomeModel.js';
import { authService } from '../../auth/services/AuthService.js';
import { eventBus } from '../../../shared/utils/eventBus.js';

export class HomeViewModel extends BaseViewModel {
  constructor(options = {}) {
    const model = options.model || new HomeModel();
    super({ ...options, model });
  }

  _initState() {
    super._initState();
  }

  async submitLogin(email, password) {
    try {
      console.log('Intentando iniciar sesión...', { email });
      const sessionData = await authService.login({ email, password });
      console.log('Login exitoso en Firebase:', sessionData);
      
      const el = document.getElementById('home-login-error');
      if (el) {
        el.style.color = 'green';
        el.textContent = '¡Inicio de sesión exitoso! Ingresando...';
      }
      // Dejamos que main.js y onAuthStateChanged manejen la redirección automáticamente
      // una vez que hayan obtenido el grado de Firebase Firestore.
    } catch (error) {
      console.error('[HomeViewModel] Error en submitLogin:', error);
      const el = document.getElementById('home-login-error');
      if (el) {
        el.style.color = 'red';
        let msg = 'Credenciales incorrectas.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
          msg = 'Correo o contraseña inválidos.';
        } else if (error.code === 'auth/too-many-requests') {
          msg = 'Demasiados intentos. Intenta más tarde.';
        }
        el.textContent = msg + ' (' + error.message + ')';
      }
    }
  }

  async submitRegister(name, email, password, character, grade) {
    try {
      console.log('Intentando registrar usuario en Firebase Auth...', { name, email, character, grade });
      const sessionData = await authService.register({ name, email, password });
      console.log('Usuario creado en Auth y guardado en Firestore:', sessionData);
      
      if (character || grade) {
        console.log('Actualizando perfil con personaje y grado...');
        await authService.updateProfile({ character, grade });
        console.log('Perfil actualizado en Firestore.');
      }

      const el = document.getElementById('home-reg-error');
      if (el) {
        el.style.color = 'green';
        el.textContent = '¡Registro exitoso! Tus datos han sido guardados en Firestore.';
      }

      // Esperamos 2 segundos para que el usuario vea el mensaje antes de cambiar de pantalla
      setTimeout(() => {
        eventBus.emit('auth:registerSuccess', { user: sessionData.user });
      }, 2000);
      
    } catch (error) {
      console.error('[HomeViewModel] Error en submitRegister:', error);
      const el = document.getElementById('home-reg-error');
      if (el) {
        el.style.color = 'red';
        // Mostrar mensaje amigable si es de firebase
        let msg = 'Error al crear la cuenta. Verifica los datos.';
        if (error.code === 'auth/email-already-in-use') msg = 'El correo ya está registrado.';
        if (error.code === 'auth/weak-password') msg = 'La contraseña debe tener al menos 6 caracteres.';
        if (error.code === 'auth/invalid-email') msg = 'Correo inválido.';
        if (error.message.includes('permission')) msg = 'Error de permisos en Firestore (reglas de seguridad).';
        el.textContent = msg + ' (' + error.message + ')';
      }
    }
  }
}
