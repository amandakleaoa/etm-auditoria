import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { TarefasView } from './features/Tarefas/views/TarefasView';
import { DashboardView } from './features/Dashboard/views/DashboardView';
import { LoginView } from './features/Auth/views/LoginView';
import { useAuthStore } from './core/store/useAuthStore';

// Correção: Trocamos JSX.Element por React.ReactNode para evitar o erro TS2503
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen text-gray-900 font-sans bg-gray-50">
        <Toaster position="top-right" />
        
        {/* Renderiza a Navbar apenas se o usuário estiver logado */}
        {isAuthenticated && (
          <nav className="bg-indigo-600 text-white shadow-md p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold tracking-tight">Enterprise Task Manager</h1>
              <div className="space-x-6 font-medium flex items-center">
                <Link to="/" className="hover:text-indigo-200 transition">Tarefas</Link>
                <Link to="/dashboard" className="hover:text-indigo-200 transition">Dashboard</Link>
                
                {/* Botão de Logout */}
                <button
                  onClick={logout}
                  className="ml-4 bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 rounded-md transition text-sm font-semibold"
                >
                  Sair
                </button>
              </div>
            </div>
          </nav>
        )}

        <main className="max-w-7xl mx-auto p-6 mt-4">
          <Routes>
            {/* Rota Pública */}
            <Route path="/login" element={<LoginView />} />

            {/* Rotas Privadas */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <TarefasView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardView />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;