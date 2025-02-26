
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export function AuthGuard({ children, requireSubscription = false }: AuthGuardProps) {
  const { user } = useAuth();
  const { isSubscribed, isLoading } = useSubscription();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireSubscription) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }

    if (!isSubscribed) {
      return <Navigate to="/pricing" replace />;
    }
  }

  return <>{children}</>;
}
