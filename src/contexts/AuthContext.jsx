import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Verificar se é um profissional (trainer/admin)
    const professionals = JSON.parse(localStorage.getItem('professionals') || '[]');
    const professional = professionals.find(p => p.email === email && p.password === password && p.status === 'active');
    
    if (professional) {
      const professionalUser = {
        id: professional.id,
        email: professional.email,
        name: professional.name,
        role: professional.role,
      };
      setUser(professionalUser);
      localStorage.setItem('currentUser', JSON.stringify(professionalUser));
      return { success: true, user: professionalUser };
    }

    // Verificar se é o personal trainer padrão (compatibilidade)
    if (email === 'trainer@zen.com' && password === 'trainer123') {
      const trainerUser = {
        id: 'trainer-1',
        email: 'trainer@zen.com',
        name: 'Personal Trainer',
        role: 'trainer',
      };
      setUser(trainerUser);
      localStorage.setItem('currentUser', JSON.stringify(trainerUser));
      return { success: true, user: trainerUser };
    }

    // Verificar se é um aluno
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.email === email && s.password === password);
    
    if (student) {
      const studentUser = {
        id: student.id,
        email: student.email,
        name: student.name,
        role: 'student',
      };
      setUser(studentUser);
      localStorage.setItem('currentUser', JSON.stringify(studentUser));
      return { success: true, user: studentUser };
    }

    return { success: false, error: 'Email ou senha incorretos' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isTrainer: user?.role === 'trainer' || user?.role === 'professional',
    isStudent: user?.role === 'student',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
