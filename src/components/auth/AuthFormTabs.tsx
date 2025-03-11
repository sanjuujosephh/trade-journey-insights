
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTabContent } from "./LoginTabContent";
import { SignupTabContent } from "./SignupTabContent";

interface AuthFormTabsProps {
  onModeChange?: (mode: "reset" | "phone-verify") => void;
  onSuccess?: () => void;
}

export function AuthFormTabs({ onModeChange, onSuccess }: AuthFormTabsProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+91");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");

  const handleForgotPassword = () => {
    if (onModeChange) onModeChange("reset");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "signup");
  };

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
  };

  return (
    <Tabs 
      defaultValue="signup" 
      className="w-full auth-tabs"
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">
          Login
        </TabsTrigger>
        <TabsTrigger value="signup">
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
          onSuccess={handleSuccess}
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
          onSuccess={handleSuccess}
        />
      </TabsContent>
    </Tabs>
  );
}
