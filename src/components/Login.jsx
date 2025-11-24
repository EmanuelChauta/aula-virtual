import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import logo from '../assets/logo.jpg'; 
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: t('fill_all_fields') || "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      onLogin(user);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  return (
    // CAMBIO 1: Usamos 'flex-col' para crear una columna vertical
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        
        {/* CAMBIO 2: Barra superior para el botón (No tapa nada en móvil) */}
        <div className="w-full p-4 flex justify-end z-10">
           <LanguageToggle />
        </div>
      
        {/* CAMBIO 3: Contenedor flexible que centra la tarjeta en el espacio restante */}
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex justify-center mb-6">
                <img src={logo} alt="Logo de Aula Virtual" className="w-24 h-24 object-contain" />
              </div>
              
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                IUTAV 
              </h1>
              <p className="text-center text-gray-600 mb-8">
                {t('welcome')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800"
                      placeholder="student@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {t('btn_login') || "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {t('no_account')}
                  <button
                    onClick={onSwitchToRegister}
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors ml-1"
                  >
                    {t('link_register')}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
    </div>
  );
}

export default Login;