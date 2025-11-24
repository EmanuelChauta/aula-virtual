import React, { useState } from 'react';
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, User, UserCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button"; // Usamos ./ para evitar errores de ruta
import { useToast } from "./ui/use-toast";

// --- IMPORTACIONES DE FIREBASE (NUEVO) ---
import { auth, db } from "../firebase"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
// ----------------------------------------

function Register({ onRegister, onSwitchToLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' // Por defecto estudiante
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. CREAR USUARIO EN FIREBASE AUTHENTICATION (Login)
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. ACTUALIZAR EL NOMBRE DE PERFIL
      await updateProfile(user, {
        displayName: formData.name
      });

      // 3. GUARDAR DATOS EXTRA EN LA BASE DE DATOS (Firestore)
      // Guardamos el rol (profesor/estudiante) asociado al ID del usuario
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString()
      });

      toast({
        title: "¡Cuenta creada!",
        description: `Bienvenido a la clase, ${formData.name}.`,
      });

      // Notificar a la App principal que ya entramos
      if (onRegister) {
        onRegister({ ...formData, uid: user.uid });
      }

    } catch (error) {
      console.error(error);
      let mensaje = "Ocurrió un error al registrarse.";
      
      // Traducir errores comunes de Firebase al español
      if (error.code === 'auth/email-already-in-use') mensaje = "Este correo ya está registrado.";
      if (error.code === 'auth/weak-password') mensaje = "La contraseña debe tener al menos 6 caracteres.";
      if (error.code === 'auth/invalid-email') mensaje = "El correo no es válido.";

      toast({
        title: "Error de Registro",
        description: mensaje,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
            <p className="text-gray-500 mt-2">Únete al aula virtual</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Nombre completo"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Correo electrónico"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="Contraseña (mín. 6 caracteres)"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Selector de Rol */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  formData.role === 'student' 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-200' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <UserCircle className="w-5 h-5" />
                <span>Estudiante</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'teacher' })}
                className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  formData.role === 'teacher' 
                    ? 'bg-purple-50 border-purple-500 text-purple-700 ring-2 ring-purple-200' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                <span>Profesor</span>
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando cuenta...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button onClick={onSwitchToLogin} className="text-indigo-600 font-medium hover:underline">
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;