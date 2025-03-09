
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhoneWithIndiaCode } from "./utils/phoneFormatting";

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<{ success: boolean, requirePhoneVerify?: boolean, phone?: string }>;
}

export function SignupForm({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  phone, 
  setPhone, 
  isLoading, 
  handleSubmit 
}: SignupFormProps) {

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneWithIndiaCode(e.target.value);
    setPhone(formattedPhone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-signup">Email</Label>
        <Input
          id="email-signup"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-signup">Password</Label>
        <Input
          id="password-signup"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone-signup">Phone (WhatsApp)</Label>
        <Input
          id="phone-signup"
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
  );
}
