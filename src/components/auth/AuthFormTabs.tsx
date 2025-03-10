
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface AuthFormTabsProps {
  onModeChange?: (mode: "reset" | "phone-verify") => void;
}

export function AuthFormTabs({ onModeChange }: AuthFormTabsProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+91");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("signup"); // Changed default to signup
  const { signIn, signUp, signInWithPhone } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
        toast({ title: "Success", description: "Logged in successfully!" });
      } else {
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

  const handleForgotPassword = () => {
    if (onModeChange) onModeChange("reset");
  };

  return (
    <Tabs defaultValue="signup" className="w-full auth-tabs"> {/* Changed default to signup */}
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login" onClick={() => setMode("login")}>
          Login
        </TabsTrigger>
        <TabsTrigger value="signup" onClick={() => setMode("signup")}>
          Sign Up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
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
          onClick={handleForgotPassword}
        >
          Forgot password?
        </Button>
      </TabsContent>
      <TabsContent value="signup">
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
      </TabsContent>
    </Tabs>
  );
}
