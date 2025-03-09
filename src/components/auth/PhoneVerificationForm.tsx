
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneVerificationFormProps {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isLoading: boolean;
  handleVerifyPhone: (e: React.FormEvent) => Promise<void>;
  onBackToSignup: () => void;
}

export function PhoneVerificationForm({
  verificationCode,
  setVerificationCode,
  isLoading,
  handleVerifyPhone,
  onBackToSignup
}: PhoneVerificationFormProps) {
  return (
    <div className="space-y-4">
      <form onSubmit={handleVerifyPhone} className="space-y-4">
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
        onClick={onBackToSignup}
      >
        Back to Sign Up
      </Button>
    </div>
  );
}
