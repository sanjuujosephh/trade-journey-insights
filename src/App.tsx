
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthModal } from "./components/auth/AuthModal";
import { UserMenu } from "./components/auth/UserMenu";
import { useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function Navigation() {
  const { user } = useAuth();
  
  return (
    <div className="h-16 border-b">
      <div className="flex h-full items-center px-4 container mx-auto">
        <div className="ml-auto flex items-center space-x-4">
          {user ? <UserMenu /> : <AuthModal />}
        </div>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden">
      <Navigation />
      <main className="h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
