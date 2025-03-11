
import { useState } from "react";
import { AuthFormTabs } from "./AuthFormTabs";
import { ResetPassword } from "./ResetPassword";
import { PhoneVerification } from "./PhoneVerification";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type AuthMode = "tabs" | "reset" | "phone-verify";

interface AuthModalContentProps {
  onSuccess?: () => void;
}

export function AuthModalContent({ onSuccess }: AuthModalContentProps) {
  const [mode, setMode] = useState<AuthMode>("tabs");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+91");
  
  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };
  
  const handleSuccess = () => {
    if (onSuccess) onSuccess();
  };
  
  const renderTitle = () => {
    switch (mode) {
      case "reset":
        return "Reset Password";
      case "phone-verify":
        return "Verify Phone Number";
      default:
        return null;
    }
  };
  
  const renderDescription = () => {
    switch (mode) {
      case "reset":
        return "Enter your email to reset your password";
      case "phone-verify":
        return `Enter the verification code sent to ${phone}`;
      default:
        return null;
    }
  };
  
  return (
    <>
      {(mode === "reset" || mode === "phone-verify") && (
        <DialogHeader>
          <DialogTitle>{renderTitle()}</DialogTitle>
          <DialogDescription>{renderDescription()}</DialogDescription>
        </DialogHeader>
      )}
      
      {mode === "tabs" && (
        <AuthFormTabs
          onModeChange={(newMode) => handleModeChange(newMode as AuthMode)}
          onSuccess={handleSuccess}
        />
      )}
      
      {mode === "reset" && (
        <ResetPassword
          email={email}
          setEmail={setEmail}
          onBackToLogin={() => handleModeChange("tabs")}
          onSuccess={handleSuccess}
        />
      )}
      
      {mode === "phone-verify" && (
        <PhoneVerification
          phone={phone}
          onVerificationComplete={() => {
            handleSuccess();
            handleModeChange("tabs");
          }}
          onBackToSignup={() => handleModeChange("tabs")}
        />
      )}
    </>
  );
}
