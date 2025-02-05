import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import Login from "./pages/Login";
import Register from "./pages/Register";
import BasePage from "./pages/BasePage";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import PageNotFound from "./pages/PageNotFound";

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Verifica se o usuário está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

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

  // Componente de rota protegida
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas com Navbar e Footer */}
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
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
