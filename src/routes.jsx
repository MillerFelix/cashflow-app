import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "./components/common/Loader";

// 1. Code Splitting: Importando as páginas de forma preguiçosa (Lazy Load)
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const BasePage = React.lazy(() => import("./pages/BasePage"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Transactions = React.lazy(() => import("./pages/Transactions"));
const Goals = React.lazy(() => import("./pages/Goals"));
const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));

// 2. Movendo o ProtectedRoute para FORA do componente principal.
// Agora recebemos 'user' e 'isLoading' como propriedades (props).
const ProtectedRoute = ({ user, isLoading, children }) => {
  // Enquanto o Firebase decide se tem usuário ou não, evitamos redirecionar.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Se terminou de carregar e não tem usuário, manda pro login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se tem usuário, renderiza a página normalmente
  return children;
};

function AppRoutes() {
  const [user, setUser] = useState(null);
  // 3. Adicionando estado de carregamento inicial
  const [isLoading, setIsLoading] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); // Assim que o Firebase responder, tiramos o loading

      if (currentUser) {
        const hasSeenHelp = localStorage.getItem("hasSeenHelp");
        if (!hasSeenHelp) {
          setShowHelpModal(true);
          localStorage.setItem("hasSeenHelp", "true");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      {/* 4. O Suspense "segura" a renderização enquanto a tela (via lazy load) está sendo baixada */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <p>Carregando página...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <BasePage
                showHelpModal={showHelpModal}
                setShowHelpModal={setShowHelpModal}
              />
            }
          >
            <Route
              index
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="transactions"
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="goals"
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <Goals />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
