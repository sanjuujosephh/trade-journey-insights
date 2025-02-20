
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TradeFormHeaderProps {
  profile: any;
  user: any;
}

export function TradeFormHeader({ profile, user }: TradeFormHeaderProps) {
  return (
    <header className="mb-2 flex items-center gap-4">
      <Avatar className="h-28 w-28 [&_*]:scale-x-[-1]">
        <AvatarImage src={profile?.avatar_url} alt={profile?.username || 'User avatar'} />
        <AvatarFallback>
          {(profile?.username?.[0] || user.email?.[0] || '?').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trading Journal</h1>
        <p className="text-muted-foreground mt-1">Track, analyze, and improve your trading performance</p>
      </div>
    </header>
  );
}
