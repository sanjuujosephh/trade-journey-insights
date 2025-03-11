
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTabContent } from "./LoginTabContent";
import { SignupTabContent } from "./SignupTabContent";

interface AuthFormTabsProps {
  onModeChange?: (mode: "reset" | "phone-verify") => void;
}

export function AuthFormTabs({ onModeChange }: AuthFormTabsProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+91");
  const [mode, setMode] = useState<"login" | "signup">("signup");

  const handleForgotPassword = () => {
    if (onModeChange) onModeChange("reset");
  };

  return (
    <Tabs defaultValue="signup" className="w-full auth-tabs">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login" onClick={() => setMode("login")}>
          Login
        </TabsTrigger>
        <TabsTrigger value="signup" onClick={() => setMode("signup")}>
          Sign Up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginTabContent 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onModeChange={handleForgotPassword}
        />
      </TabsContent>
      <TabsContent value="signup">
        <SignupTabContent 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          phone={phone}
          setPhone={setPhone}
          onModeChange={onModeChange}
        />
      </TabsContent>
    </Tabs>
  );
}
