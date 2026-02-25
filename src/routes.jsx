import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "./components/common/Loader";

// Lazy Imports
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const BasePage = React.lazy(() => import("./pages/BasePage"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Transactions = React.lazy(() => import("./pages/Transactions"));
const Goals = React.lazy(() => import("./pages/Goals"));
const Cards = React.lazy(() => import("./pages/Cards"));
const Profile = React.lazy(() => import("./pages/Profile"));
const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));

const ProtectedRoute = ({ user, isLoading, children }) => {
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  if (!user) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      if (currentUser && !localStorage.getItem("hasSeenHelp")) {
        setShowHelpModal(true);
        localStorage.setItem("hasSeenHelp", "true");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader />
          </div>
        }
      >
        <Routes>
          {/* Rotas Públicas - Se logado, manda pro dashboard */}
          <Route
            path="/"
            element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/register"
            element={
              !user ? <Register /> : <Navigate to="/dashboard" replace />
            }
          />

          {/* Rotas Protegidas - Layout BasePage envolve todas */}
          <Route
            element={
              <ProtectedRoute user={user} isLoading={isLoading}>
                <BasePage
                  showHelpModal={showHelpModal}
                  setShowHelpModal={setShowHelpModal}
                />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
