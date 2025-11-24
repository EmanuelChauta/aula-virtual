import React, { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet'; // Comentado para evitar error si no está instalado

// NOTA: Cambié '@/' por './' para asegurar que encuentre los archivos
import Login from './components/Login';
import Register from './components/Register';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';
import LanguageToggle from './components/LanguageToggle';
function App() {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      const user = JSON.parse(savedUser);
      setCurrentView(user.role === 'teacher' ? 'teacherDashboard' : 'studentDashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentView(userData.role === 'teacher' ? 'teacherDashboard' : 'studentDashboard');
    toast({
      title: "Login Exitoso",
      description: `Bienvenido, ${userData.name}!`,
    });
  };

  const handleRegister = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentView(userData.role === 'teacher' ? 'teacherDashboard' : 'studentDashboard');
    toast({
      title: "Registro Exitoso",
      description: `Bienvenido al Aula Virtual, ${userData.name}!`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('login');
    toast({
      title: "Sesión Cerrada",
      description: "Has salido exitosamente.",
    });
  };

  return (
    <>
      {/* <Helmet>
        <title>Virtual Classroom</title>
      </Helmet> 
      */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {currentView === 'login' && (
          <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setCurrentView('register')} 
          />
        )}
        
        {currentView === 'register' && (
          <Register 
            onRegister={handleRegister} 
            onSwitchToLogin={() => setCurrentView('login')} 
          />
        )}
        
        {currentView === 'teacherDashboard' && (
          <TeacherDashboard 
            user={currentUser} 
            onLogout={handleLogout} 
          />
        )}
        
        {currentView === 'studentDashboard' && (
          <StudentDashboard 
            user={currentUser} 
            onLogout={handleLogout} 
          />
        )}
        
        
        <Toaster />
      </div>
    </>
  );
}



export default App;