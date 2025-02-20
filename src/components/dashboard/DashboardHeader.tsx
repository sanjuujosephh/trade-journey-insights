
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

interface DashboardHeaderProps {
  profile: any;
  user: any;
}

export function DashboardHeader({ profile, user }: DashboardHeaderProps) {
  return (
    <header className="mb-2 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-28 w-28 [&_*]:scale-x-[-1]">
          <AvatarImage src={profile?.avatar_url} alt={profile?.username || 'User avatar'} />
          <AvatarFallback>
            {(profile?.username?.[0] || user.email?.[0] || '?').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hey {profile?.first_name || 'There'}
          </h1>
          <p className="text-muted-foreground mt-1">Track, analyze, and improve your trading performance</p>
        </div>
      </div>
      <Button variant="outline" className="gap-2">
        <Video className="h-4 w-4" />
        <span>Watch Overview</span>
      </Button>
    </header>
  );
}
