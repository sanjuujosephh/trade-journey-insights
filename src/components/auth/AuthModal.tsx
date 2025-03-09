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
  const [phone, setPhone] = useState("+91");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, resetPassword, signInWithPhone, verifyOtp } = useAuth();
  const { toast } = useToast();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Keep +91 prefix fixed, only allow changing the part after that
    if (input.startsWith("+91")) {
      setPhone(input);
    } else if (input === "") {
      // If they delete everything, reset to just +91
      setPhone("+91");
    } else if (!input.startsWith("+91")) {
      // If they try to delete or change the prefix, keep the +91 and add their input
      setPhone("+91" + input.replace(/\D/g, ''));
    }
  };

  const validateInput = () => {
    if (mode === "phone-verify") {
      if (!verificationCode) {
        throw new Error("Please enter the verification code");
      }
      return;
    }

    if (!email) {
      throw new Error("Please enter your email");
    }
    
    if (mode !== "reset" && !password) {
      throw new Error("Please enter your password");
    }
    
    if (mode === "signup" && password.length < 6) {
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
      
      if (mode === "login") {
        await signIn(email, password);
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        setIsOpen(false);
      } else if (mode === "signup") {
        await signUp(email, password);
        
        // If phone is provided (beyond the default +91), verify it
        if (phone.length > 3) {
          await signInWithPhone(phone);
          toast({
            title: "Success",
            description: "Verification code sent to your phone. Please check your email to confirm your account.",
          });
          setMode("phone-verify");
        } else {
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
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {mode !== "reset" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          )}
          
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (WhatsApp)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91"
                value={phone}
                onChange={handlePhoneChange}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Optional: We'll use this for WhatsApp communication
              </p>
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
