import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;