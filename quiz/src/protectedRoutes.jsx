import { useAuth } from "./context/authContext";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "./components/ui/loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isRefreshing } = useAuth();
  const location = useLocation();

  // ✅ Wait until restoreSession / token refresh finishes
  if (loading || isRefreshing) return <Loading />;

  // ✅ Only redirect if restore finished and no user
  if (!user && !loading && !isRefreshing) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
