
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PhoneVerificationForm } from "./PhoneVerificationForm";

interface PhoneVerificationProps {
  phone: string;
  onVerificationComplete: () => void;
  onBackToSignup: () => void;
}

export function PhoneVerification({ 
  phone, 
  onVerificationComplete,
  onBackToSignup
}: PhoneVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOtp } = useAuth();
  const { toast } = useToast();
  
  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast({
        title: "Validation Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await verifyOtp(phone, verificationCode);
      toast({
        title: "Success",
        description: "Phone number verified successfully!",
      });
      onVerificationComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Verification failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PhoneVerificationForm
      verificationCode={verificationCode}
      setVerificationCode={setVerificationCode}
      isLoading={isLoading}
      handleVerifyPhone={handleVerifyPhone}
      onBackToSignup={onBackToSignup}
    />
  );
}
