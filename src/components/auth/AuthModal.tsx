
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AuthMode = "login" | "signup" | "reset" | "phone-verify";

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, resetPassword, signInWithPhone, verifyOtp } = useAuth();
  const { toast } = useToast();

  const formatPhoneNumber = (input: string): string => {
    // Ensure phone number starts with +91 for India
    if (!input.startsWith("+91") && input.length > 0) {
      return "+91" + input.replace(/\D/g, '');
    }
    return input.replace(/\D/g, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  const validateInput = () => {
    if (mode === "phone-verify") {
      if (!verificationCode) {
        throw new Error("Please enter the verification code");
      }
      return;
    }

    if (mode === "signup" && phone) {
      // For phone signup, we only need the phone number
      if (!phone.startsWith("+91") || phone.length < 12) {
        throw new Error("Please enter a valid Indian phone number");
      }
      return;
    }

    if (!email && !phone) {
      throw new Error("Please enter email or phone number");
    }
    
    if (mode !== "reset" && !phone && !password) {
      throw new Error("Please enter your password");
    }
    
    if (mode === "signup" && !phone && password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      validateInput();
      
      if (mode === "phone-verify") {
        await verifyOtp(phone, verificationCode);
        toast({
          title: "Success",
          description: "Phone verified successfully!",
        });
        setIsOpen(false);
        return;
      }
      
      console.log(`Attempting ${mode} with email: ${email} or phone: ${phone}`);
      
      if (mode === "login") {
        await signIn(email, password);
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        setIsOpen(false);
      } else if (mode === "signup") {
        if (phone && phone.startsWith("+91")) {
          await signInWithPhone(phone);
          toast({
            title: "Success",
            description: "Verification code sent to your phone.",
          });
          setMode("phone-verify");
        } else {
          await signUp(email, password);
          toast({
            title: "Success",
            description: "Please check your email to confirm your account.",
          });
          setIsOpen(false);
        }
      } else if (mode === "reset") {
        await resetPassword(email);
        toast({
          title: "Success",
          description: "Password reset instructions sent to your email.",
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message
          : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAuthForm = () => {
    if (mode === "phone-verify") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Verify Phone Number</DialogTitle>
            <DialogDescription>
              Enter the verification code sent to {phone}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                disabled={isLoading}
                maxLength={6}
              />
            </div>
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Phone"}
              </Button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-primary hover:underline text-sm"
                disabled={isLoading}
              >
                Back to Sign Up
              </button>
            </div>
          </form>
        </>
      );
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Login" : mode === "signup" ? "Sign Up" : "Reset Password"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Enter your credentials to access your account"
              : mode === "signup"
              ? "Create a new account"
              : "Enter your email to reset your password"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode !== "signup" || !phone ? (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!phone}
                disabled={isLoading}
              />
            </div>
          ) : null}

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Indian)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 9999999999"
                value={phone}
                onChange={handlePhoneChange}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Enter your Indian mobile number starting with +91
              </p>
            </div>
          )}

          {mode !== "reset" && (!phone || mode === "login") && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!phone}
                disabled={isLoading}
                minLength={6}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Please wait..." : mode === "login" ? "Login" : mode === "signup" ? "Sign Up" : "Reset Password"}
            </Button>
            <div className="flex gap-2 text-sm">
              {mode === "login" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Don't have an account?
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setMode("reset")}
                    className="text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  Already have an account?
                </button>
              )}
            </div>
          </div>
        </form>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login / Sign Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {renderAuthForm()}
      </DialogContent>
    </Dialog>
  );
}
