
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialMediaSectionProps {
  twitterId: string | null;
  telegramId: string | null;
  onChange: (field: string, value: string) => void;
}

export function SocialMediaSection({
  twitterId,
  telegramId,
  onChange,
}: SocialMediaSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="twitter">Twitter Username</Label>
        <Input
          id="twitter"
          value={twitterId || ""}
          onChange={(e) => onChange("twitter_id", e.target.value)}
          placeholder="Enter your Twitter username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telegram">Telegram Username</Label>
        <Input
          id="telegram"
          value={telegramId || ""}
          onChange={(e) => onChange("telegram_id", e.target.value)}
          placeholder="Enter your Telegram username"
        />
      </div>
    </div>
  );
}
