import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Spinner from "../components/shared/Spinner";

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
