// src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useSelector((state) => state.auth);

  const isAuthenticated = !!token && !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth);

  const isAuthenticated = !!token && !!user;

  if (isAuthenticated) {
    // redirect based on role
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "seller") return <Navigate to="/seller/panel" replace />;
    if (user.role === "user") return <Navigate to="/" replace />;
  }

  return children;
}

export { ProtectedRoute, PublicRoute };
