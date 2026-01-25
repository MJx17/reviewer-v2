import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/Login";
import Loading from "../components/ui/loading"; // import your spinner

const LoginPage = () => {
  const { user, loading, isRefreshing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isRefreshing && user) {
      // User is already authenticated → redirect to /home
      navigate("/home", { replace: true });
    }
  }, [user, loading, isRefreshing, navigate]);

  // ✅ Show spinner while restoreSession / refresh is in progress
  if (loading || isRefreshing) return <Loading />;

  return (
    <div>
      <LoginModal />
    </div>
  );
};

export default LoginPage;
