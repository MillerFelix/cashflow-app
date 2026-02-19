/**
 * Configuração Central do Firebase
 * Inicializa o aplicativo e exporta as instâncias de Auth e Firestore
 * utilizando variáveis de ambiente para maior segurança.
 */
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  deleteDoc,
  doc,
  getFirestore,
  collection,
  addDoc,
  setDoc,
  query,
  where,
  orderBy,
  getDocs,
  writeBatch,
} from "firebase/firestore";

// A configuração agora busca os dados do arquivo .env (localmente)
// ou do painel de hospedagem (em produção)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializa o aplicativo Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o banco de dados Firestore
const db = getFirestore(app);

// Inicializa o serviço de Autenticação
export const auth = getAuth(app);

export {
  db,
  addDoc,
  setDoc,
  collection,
  query,
  where,
  writeBatch,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  onAuthStateChanged,
};
