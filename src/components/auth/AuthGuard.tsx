
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export function AuthGuard({ children, requireSubscription = false }: AuthGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Since the platform is now free, we don't need to check for subscriptions
  return <>{children}</>;
}
