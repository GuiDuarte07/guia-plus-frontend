import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isLoggedIn = AuthService.isTokenValid();

  if(!isLoggedIn) {
    localStorage.clear();
    return  <Navigate to="/auth" replace />;
  }

  return element;
};

export default ProtectedRoute;