// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE ---
// Debe verse parecido a esto:
const firebaseConfig = {
  apiKey: "AIzaSyDF5tRdOjRrse4gq5W3nqX1mKnR85P3XSg",
  authDomain: "aula-virtual-db.firebaseapp.com",
  projectId: "aula-virtual-db",
  storageBucket: "aula-virtual-db.firebasestorage.app",
  messagingSenderId: "947238348322",
  appId: "1:947238348322:web:477c69b1d5cdf584f98c7b"
};
// ----------------------------------------------

// Inicializamos la conexión
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas para usarlas en toda la app
export const db = getFirestore(app); // Base de datos
export const auth = getAuth(app);    // Login de usuarios