
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthFormTabs } from "./AuthFormTabs";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { PhoneVerificationForm } from "./PhoneVerificationForm";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+91");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "reset" | "phone-verify">("signup");
  const [verificationCode, setVerificationCode] = useState("");
  const { resetPassword, verifyOtp } = useAuth();
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      toast({
        title: "Success",
        description: "Check your email for password reset instructions",
      });
      setMode("login");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await verifyOtp(phone, verificationCode);
      toast({ title: "Success", description: "Phone verified successfully!" });
      setMode("login");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: "reset" | "phone-verify") => {
    setMode(newMode);
  };

  if (mode === "reset") {
    return (
      <ResetPasswordForm
        email={email}
        setEmail={setEmail}
        isLoading={isLoading}
        handleResetPassword={handleResetPassword}
        onBackToLogin={() => setMode("login")}
      />
    );
  }

  if (mode === "phone-verify") {
    return (
      <PhoneVerificationForm
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        isLoading={isLoading}
        handleVerifyPhone={handleVerifyPhone}
        onBackToSignup={() => setMode("signup")}
      />
    );
  }

  return (
    <AuthFormTabs onModeChange={handleModeChange} defaultTab="signup" />
  );
}
