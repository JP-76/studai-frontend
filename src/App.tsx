import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { isAuthenticated } from './lib/axios';
import { useEffect, useState } from 'react';

import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Auth from './pages/Auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  excludePaths?: string[];
}

function ProtectedRoute({ children, excludePaths = [] }: ProtectedRouteProps) {
  const location = useLocation();
  const isExcluded = excludePaths.some((path) => location.pathname === path);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      if (isExcluded) {
        setValid(true);
        setLoading(false);
        return;
      }
      const result = await isAuthenticated();
      if (mounted) {
        setValid(result);
        setLoading(false);
      }
    }
    checkAuth();
    return () => { mounted = false; };
  }, [location.pathname, isExcluded]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>;
  }
  if (!valid) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
