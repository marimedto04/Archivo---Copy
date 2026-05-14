/**
 * AuthService
 * ------------
 * Capa de acceso a datos del módulo AUTH.
 * Se integra con Firebase v9 (Auth + Firestore).
 */

import { auth, db, googleProvider } from '../../../firebase.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

class AuthService {
  /**
   * Autentica al usuario con email y password.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ user: object }>}
   */
  async login(credentials) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    return { user: this._formatUser(userCredential.user) };
  }

  /**
   * Autentica al usuario con Google Sign-In.
   * @returns {Promise<{ user: object }>}
   */
  async loginWithGoogle() {
    const userCredential = await signInWithPopup(auth, googleProvider);
    
    const user = userCredential.user;
    
    // Guardar o actualizar datos básicos en Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      nombre: user.displayName || 'Usuario Google',
      correo: user.email,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return { user: this._formatUser(user) };
  }

  /**
   * Registra un nuevo usuario en Firebase Auth y guarda en Firestore.
   * @param {{ name: string, email: string, password: string }} userData
   * @returns {Promise<{ user: object }>}
   */
  async register(userData) {
    // 1. Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const user = userCredential.user;

    // 2. Crear documento en Firestore collection "users"
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      nombre: userData.name,
      correo: userData.email,
      createdAt: new Date().toISOString()
    });

    return { user: this._formatUser(user) };
  }

  /**
   * Cierra la sesión del usuario actual en Firebase.
   * @returns {Promise<void>}
   */
  async logout() {
    return signOut(auth);
  }

  /**
   * Actualiza el perfil en Firestore (personaje, grado, etc.)
   * @param {object} profileData
   * @returns {Promise<{ user: object }>}
   */
  async updateProfile(profileData) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No hay usuario autenticado en Firebase');

    // Actualizamos el documento en Firestore con el personaje y grado
    await setDoc(doc(db, 'users', currentUser.uid), profileData, { merge: true });

    const user = this._formatUser(currentUser);
    return { user: { ...user, ...profileData } };
  }

  _formatUser(firebaseUser) {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || '',
    };
  }
}

export const authService = new AuthService();
