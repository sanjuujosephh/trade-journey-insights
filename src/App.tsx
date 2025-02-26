
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserMenu } from "./components/auth/UserMenu";
import { useAuth } from "./contexts/AuthContext";
import { AuthGuard } from "./components/auth/AuthGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Button } from "./components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./contexts/ThemeProvider";
import { TraderInfo } from "./components/TraderInfo";
import { AuthModal } from "./components/auth/AuthModal";
import { Footer } from "./components/Footer";
import { MonthlyPnL } from "./components/MonthlyPnL";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div data-theme-toggle>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}

function Navigation() {
  const { user } = useAuth();
  
  return (
    <div className="h-16 border-b bg-background sticky top-0 z-10">
      <div className="flex h-full items-center px-4 container mx-auto">
        <div className="flex-1 md:block hidden">
          {user && <TraderInfo />}
        </div>
        <div className="flex-1 flex md:justify-center justify-start">
          <Link to="/" className="text-xl font-medium hover:opacity-80 transition-opacity">
            Onetradejournal
          </Link>
        </div>
        <div className="flex-1 flex justify-end items-center gap-2">
          {user && <MonthlyPnL />}
          <ThemeToggle />
          <div data-user-nav>
            {user ? <UserMenu /> : <AuthModal />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

const App = () => {
  const { user } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    user ? (
                      <AuthGuard requireSubscription={true}>
                        <Index />
                      </AuthGuard>
                    ) : (
                      <Index />
                    )
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
