
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "./LoginForm";
import { Button } from "@/components/ui/button";

interface LoginTabContentProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onModeChange?: () => void;
}

export function LoginTabContent({
  email,
  setEmail,
  password,
  setPassword,
  onModeChange
}: LoginTabContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return { success: false };
    }
    
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({ title: "Success", description: "Logged in successfully!" });
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <LoginForm 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
      <Button
        type="button"
        variant="link"
        className="px-0 mt-2"
        onClick={onModeChange}
      >
        Forgot password?
      </Button>
    </div>
  );
}
