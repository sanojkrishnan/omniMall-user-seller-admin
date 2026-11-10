import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Private route
function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useSelector((state) => state.auth);
  const { seller, sellerToken } = useSelector((state) => state.seller);

  const isAuthenticated = !!token && !!user;
  const isSellerAuthenticated = !!sellerToken && !!seller;

  // Check whether the authenticated account has permission
  const hasAccess = allowedRoles
    ? allowedRoles.some((role) => {
        if (role === "seller") return isSellerAuthenticated;

        return isAuthenticated && user.role === role;
      })
    : isAuthenticated || isSellerAuthenticated;

  if (!hasAccess) {
    // Guest
    if (!isAuthenticated && !isSellerAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // Normal user trying to access seller/admin pages
    if (isAuthenticated && user.role === "user") {
      return <Navigate to="/user" replace />;
    }

    // Seller trying to access another role's pages
    if (isSellerAuthenticated) {
      return <Navigate to="/seller/dashboard" replace />;
    }

    // Admin
    if (isAuthenticated && user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/not-found" replace />;
  }

  return children;
}

// Public route (login, register, forgot password, etc.)
function PublicRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth);
  const { seller, sellerToken } = useSelector((state) => state.seller);

  const isAuthenticated = !!token && !!user;
  const isSellerAuthenticated = !!sellerToken && !!seller;

  if (isSellerAuthenticated) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  if (isAuthenticated) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;

      case "seller":
        return <Navigate to="/seller/dashboard" replace />;

      case "user":
        return <Navigate to="/user" replace />;

      default:
        return <Navigate to="/not-found" replace />;
    }
  }

  return children;
}

// Restricted route (accessible to guests and normal users,
// but not admins or sellers)
function RestrictRoles({ children, blockedRoles = [] }) {
  const { user, token } = useSelector((state) => state.auth);
  const { seller, sellerToken } = useSelector((state) => state.seller);

  const isAuthenticated = !!token && !!user;
  const isSellerAuthenticated = !!sellerToken && !!seller;

  if (isSellerAuthenticated && blockedRoles.includes("seller")) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  if (isAuthenticated && blockedRoles.includes(user.role)) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;

      case "seller":
        return <Navigate to="/seller/dashboard" replace />;

      default:
        return <Navigate to="/user" replace />;
    }
  }

  return children;
}

export { ProtectedRoute, PublicRoute, RestrictRoles };
