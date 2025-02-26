
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ErrorBoundary } from 'react-error-boundary';

import Index from "@/pages/Index";
import AuthCallback from "@/pages/AuthCallback";
import Shop from "@/pages/Shop";
import NotFound from "@/pages/NotFound";
import ResetPassword from "@/pages/ResetPassword";

const queryClient = new QueryClient();

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="p-4">
      <p className="text-red-500 font-bold">Something went wrong:</p>
      <pre className="mt-2 text-red-400 bg-red-50 p-2 rounded">{error.message}</pre>
      <button 
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <SubscriptionProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </SubscriptionProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
