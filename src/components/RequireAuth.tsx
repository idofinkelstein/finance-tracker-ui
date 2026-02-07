import { useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Re-check from localStorage on mount (handles post-login navigation when state may not have updated yet)
    const isValid = checkAuth();
    if (!isValid) {
      navigate('/login', {
        state: { from: location.pathname }
      });
    }
  }, [checkAuth, navigate, location.pathname]);

  // If not authenticated, don't render (either redirecting or waiting for checkAuth to update state)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth; 