import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("ADMIN ROUTE CHECK:", {
    loading,
    user,
    role: user?.role,
    pathname: location.pathname,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="font-display text-plum/50">
          Checking admin access...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (user.role !== "admin") {
    console.log("ADMIN BLOCKED - ROLE IS:", user.role);
    return <Navigate to="/" replace />;
  }

  console.log("ADMIN ACCESS GRANTED");

  return children;
}