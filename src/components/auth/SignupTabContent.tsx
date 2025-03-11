
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SignupForm } from "./SignupForm";

interface SignupTabContentProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  onModeChange?: (mode: "phone-verify") => void;
}

export function SignupTabContent({
  email,
  setEmail,
  password,
  setPassword,
  phone,
  setPhone,
  onModeChange,
}: SignupTabContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithPhone } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signUp(email, password);
      if (phone.length > 3) {
        await signInWithPhone(phone);
        toast({
          title: "Success",
          description: "Verification code sent to your phone. Please check your email to confirm your account.",
        });
        if (onModeChange) onModeChange("phone-verify");
        return { success: true, requirePhoneVerify: true, phone };
      } else {
        toast({
          title: "Success",
          description: "Please check your email to confirm your account.",
        });
      }
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
    <SignupForm 
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      phone={phone}
      setPhone={setPhone}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
    />
  );
}
