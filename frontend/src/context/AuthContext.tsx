import React, { createContext, useState, useContext, ReactNode } from 'react';

// Definimos la estructura del usuario basándonos en lo que nos devolvió Postman
interface UsuarioSesion {
  id_Usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  id_departamento?: number;
}

interface AuthContextType {
  user: UsuarioSesion | null;
  login: (userData: UsuarioSesion) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UsuarioSesion | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: UsuarioSesion) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};