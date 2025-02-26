
import { useAuth } from "@/contexts/AuthContext";
import { LandingPage } from "@/components/landing/LandingPage";
import { MainDashboard } from "@/components/dashboard/MainDashboard";

export default function Index() {
  const { user } = useAuth();

  if (!user) {
    return <LandingPage />;
  }

  return <MainDashboard />;
}
