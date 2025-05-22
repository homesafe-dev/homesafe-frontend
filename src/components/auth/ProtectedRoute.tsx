import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingIndicator from '../common/LoadingIndicator';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * A component that protects routes based on authentication and user role
 * @param children - The components to render if the user is authenticated and has the required role
 * @param allowedRoles - Optional array of roles that are allowed to access this route
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { isAuthenticated, user, authInitialized } = useAuth();
  const location = useLocation();

  // If auth is not yet initialized, show loading state
  if (!authInitialized) {
    return <LoadingIndicator />;
  }

  // If user is not authenticated, check if this is a page refresh
  if (!isAuthenticated) {
    // Store the attempted URL for redirecting after login
    sessionStorage.setItem('redirectAfterLogin', location.pathname);

    // Check if there's a token in localStorage but user state hasn't been set yet
    // This can happen during page refresh before the auth state is fully initialized
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    const isPageRefresh = sessionStorage.getItem('is_page_refresh') === 'true';

    // Double-check: if we have token and user data but auth says we're not authenticated,
    // it might be a race condition. Show loading for a bit longer.
    if (token && storedUser && isPageRefresh) {
      // If this is a page refresh and we have a token, show loading or return null
      // This prevents immediate redirect to login during the auth state initialization
      return <LoadingIndicator />;
    }

    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided and user's role is not in the allowed roles, redirect to their dashboard
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.type)) {
    // Redirect to the appropriate dashboard based on user role
    if (user.type === 'employer') {
      return <Navigate to="/employer/dashboard" replace />;
    } else if (user.type === 'employee') {
      return <Navigate to="/employee/dashboard" replace />;
    } else if (user.type === 'agent') {
      return <Navigate to="/agent/dashboard" replace />;
    } else if (user.type === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // Default fallback

    return <Navigate to="/" replace />;
  }

  // If user is authenticated and has the required role, render the children

  return <>{children}</>;
};

export default ProtectedRoute;
