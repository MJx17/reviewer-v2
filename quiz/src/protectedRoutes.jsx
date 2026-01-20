import { useAuth } from "./context/authContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isRefreshing } = useAuth();
  const location = useLocation();

  // Show spinner while checking auth or refreshing token
  if (loading || isRefreshing) return null; // or <Spinner />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
