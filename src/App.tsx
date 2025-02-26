import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

const queryClient = new QueryClient();

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <SubscriptionProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
              </Router>
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
