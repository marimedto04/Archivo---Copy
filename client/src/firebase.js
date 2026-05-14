import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDf82cM2oWpU1M_N2_Rxs6iVArQoMc2HLg",
  authDomain: "rag-numi.firebaseapp.com",
  projectId: "rag-numi",
  storageBucket: "rag-numi.firebasestorage.app",
  messagingSenderId: "237541733416",
  appId: "1:237541733416:web:78ed4347a78a59107bf11d",
  measurementId: "G-JV4YDXFP4Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider =
  new GoogleAuthProvider();

export const db = getFirestore(app);
