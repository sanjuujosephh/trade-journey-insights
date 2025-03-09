
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResetPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  handleResetPassword: (e: React.FormEvent) => Promise<void>;
  onBackToLogin: () => void;
}

export function ResetPasswordForm({
  email,
  setEmail,
  isLoading,
  handleResetPassword,
  onBackToLogin
}: ResetPasswordFormProps) {
  return (
    <div className="space-y-4">
      <form onSubmit={handleResetPassword} className="space-y-4">
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
        onClick={onBackToLogin}
      >
        Back to Login
      </Button>
    </div>
  );
}
