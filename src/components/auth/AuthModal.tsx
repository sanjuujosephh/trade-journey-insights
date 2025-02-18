
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

type AuthMode = "login" | "signup" | "reset";

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  const validateInput = () => {
    if (!email || !password) {
      throw new Error("Please fill in all fields");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode !== "reset") {
        validateInput();
      }
      
      console.log(`Attempting ${mode} with email: ${email}`);
      
      if (mode === "login") {
        await signIn(email, password);
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        setIsOpen(false);
      } else if (mode === "signup") {
        await signUp(email, password);
        toast({
          title: "Success",
          description: "Please check your email to confirm your account.",
        });
        setIsOpen(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login / Sign Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
      </DialogContent>
    </Dialog>
  );
}
