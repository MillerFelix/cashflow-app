// Importando as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Adicione o onAuthStateChanged aqui
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

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB2EmaUqHJncKOFCtA3D4rpCKEwPjmRRcA",
  authDomain: "cashflow-cf.firebaseapp.com",
  projectId: "cashflow-cf",
  storageBucket: "cashflow-cf.firebasestorage.app",
  messagingSenderId: "628799718760",
  appId: "1:628799718760:web:120ad45c73b9439ca782dd",
  measurementId: "G-M6ZRZHCGR2",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

// Inicializa a autenticação
export const auth = getAuth(app);

// Exportando funções úteis para outros arquivos
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
  onAuthStateChanged, // Exporte o onAuthStateChanged aqui
};
