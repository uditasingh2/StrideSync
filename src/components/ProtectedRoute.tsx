import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return children;
}
