
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ResetPasswordForm } from "./ResetPasswordForm";

interface ResetPasswordProps {
  email: string;
  setEmail: (email: string) => void;
  onBackToLogin: () => void;
}

export function ResetPassword({ 
  email, 
  setEmail, 
  onBackToLogin 
}: ResetPasswordProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Validation Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      toast({
        title: "Success",
        description: "Password reset instructions sent to your email",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send reset instructions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ResetPasswordForm
      email={email}
      setEmail={setEmail}
      isLoading={isLoading}
      handleResetPassword={handleResetPassword}
      onBackToLogin={onBackToLogin}
    />
  );
}
