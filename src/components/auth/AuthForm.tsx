
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "reset" | "phone-verify">("login");
  const [verificationCode, setVerificationCode] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "reset") {
        await resetPassword(email);
        toast({
          title: "Success",
          description: "Check your email for password reset instructions",
        });
        setMode("login");
      } else if (mode === "login") {
        await signIn(email, password);
        toast({ title: "Success", description: "Logged in successfully!" });
      } else if (mode === "phone-verify") {
        await verifyOtp(phone, verificationCode);
        toast({ title: "Success", description: "Phone verified successfully!" });
        setMode("login");
      } else {
        // For signup, we now need to check if they're using phone or email
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
        }
      }
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

  if (mode === "reset") {
    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-reset">Email</Label>
            <Input
              id="email-reset"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Instructions"}
          </Button>
        </form>
        <Button
          variant="link"
          className="px-0"
          onClick={() => setMode("login")}
        >
          Back to Login
        </Button>
      </div>
    );
  }

  if (mode === "phone-verify") {
    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="Enter 6-digit verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              disabled={isLoading}
              maxLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Phone Number"}
          </Button>
        </form>
        <Button
          variant="link"
          className="px-0"
          onClick={() => setMode("signup")}
        >
          Back to Sign Up
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="login" className="w-full auth-tabs">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login" onClick={() => setMode("login")}>
          Login
        </TabsTrigger>
        <TabsTrigger value="signup" onClick={() => setMode("signup")}>
          Sign Up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-login">Email</Label>
            <Input
              id="email-login"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-login">Password</Label>
            <Input
              id="password-login"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : "Login"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="px-0"
            onClick={() => setMode("reset")}
          >
            Forgot password?
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="signup">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-signup">Email</Label>
            <Input
              id="email-signup"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone-signup">Phone (Indian)</Label>
            <Input
              id="phone-signup"
              type="tel"
              placeholder="+91 9999999999"
              value={phone}
              onChange={handlePhoneChange}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Please enter your Indian mobile number starting with +91
            </p>
          </div>
          {!phone && (
            <div className="space-y-2">
              <Label htmlFor="password-signup">Password (for email signup)</Label>
              <Input
                id="password-signup"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
            </div>
          )}
          <div className="text-sm">
            <div className="inline-flex items-center gap-2">
              <span className="font-semibold text-primary">Special Launch Offer:</span>
              <span className="text-2xl font-bold text-primary">₹199</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : "Sign Up"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
