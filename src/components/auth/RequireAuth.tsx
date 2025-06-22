
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  children: ReactNode;
  adminOnly?: boolean;
}

// Admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export default function RequireAuth({ children, adminOnly = false }: RequireAuthProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if user is an admin based on stored credentials
    const checkAdminStatus = () => {
      const storedUsername = localStorage.getItem('adminUsername');
      const storedPassword = localStorage.getItem('adminPassword');
      
      const isAdminUser = 
        storedUsername === ADMIN_USERNAME && 
        storedPassword === ADMIN_PASSWORD;
      
      setIsAdmin(isAdminUser);
    };
    
    checkAdminStatus();
  }, []);

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading authentication...</div>;
  }
  
  // If admin-only route and user is not admin
  if (adminOnly && isAdmin === false) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // For regular protected routes
  if (!adminOnly && !isSignedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Helper function to check if a user is admin (can be used elsewhere in the app)
export function checkIsAdmin(): boolean {
  const storedUsername = localStorage.getItem('adminUsername');
  const storedPassword = localStorage.getItem('adminPassword');
  
  return (
    storedUsername === ADMIN_USERNAME && 
    storedPassword === ADMIN_PASSWORD
  );
}

// Helper function to set admin credentials (for login)
export function setAdminCredentials(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem('adminUsername', username);
    localStorage.setItem('adminPassword', password);
    return true;
  }
  return false;
}
