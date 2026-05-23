import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
// 👇 IMPORTAMOS EL PROVEEDOR GLOBAL DE AUTENTICACIÓN
import { AuthProvider } from './context/AuthContext.tsx'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> {/* 🔐 Envuelve a toda la aplicación */}
      <App />
    </AuthProvider>
  </StrictMode>,
);