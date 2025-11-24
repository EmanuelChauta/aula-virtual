// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// AQUÍ ESTÁN TUS TRADUCCIONES
const resources = {
  es: {
    translation: {
      "welcome": "Bienvenido al Aula",
      "login_title": "Iniciar Sesión",
      "register_title": "Crear Cuenta",
      "email": "Correo Electrónico",
      "password": "Contraseña",
      "name": "Nombre Completo",
      "confirm_password": "Confirmar Contraseña",
      "role": "Soy un...",
      "student": "Estudiante",
      "teacher": "Profesor",
      "btn_login": "Entrar",
      "btn_register": "Registrarse",
      "no_account": "¿No tienes cuenta?",
      "have_account": "¿Ya tienes cuenta?",
      "link_register": "Regístrate aquí",
      "link_login": "Inicia sesión aquí",
      "lang_btn": "English" // Texto del botón para cambiar
    }
  },
  en: {
    translation: {
      "welcome": "Welcome to Classroom",
      "login_title": "Sign In",
      "register_title": "Create Account",
      "email": "Email Address",
      "password": "Password",
      "name": "Full Name",
      "confirm_password": "Confirm Password",
      "role": "I am a...",
      "student": "Student",
      "teacher": "Teacher",
      "btn_login": "Sign In",
      "btn_register": "Sign Up",
      "no_account": "Don't have an account?",
      "have_account": "Already have an account?",
      "link_register": "Register here",
      "link_login": "Login here",
      "lang_btn": "Español"
    }
  }
};

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto si falla
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;