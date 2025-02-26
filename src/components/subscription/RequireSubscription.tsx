
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface RequireSubscriptionProps {
  children: React.ReactNode;
}

export function RequireSubscription({ children }: RequireSubscriptionProps) {
  const { hasActiveSubscription, isLoading } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !hasActiveSubscription && user) {
      toast.error("Please subscribe to access this feature");
      navigate("/shop");
    }
  }, [hasActiveSubscription, isLoading, user, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!hasActiveSubscription && user) {
    return null;
  }

  return <>{children}</>;
}
