import { useAuth } from "./context/authContext";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "./components/ui/loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isRefreshing } = useAuth();
  const location = useLocation();

  // ✅ Wait until restoreSession / token refresh finishes
  if (loading || isRefreshing) return <Loading />;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default ProtectedRoute;
