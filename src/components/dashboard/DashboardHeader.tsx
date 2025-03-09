
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy, Video, Youtube } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  profile: any;
  user: any;
}

export function DashboardHeader({ profile, user }: DashboardHeaderProps) {
  const { isSubscribed } = useSubscription();

  return (
    <header className="mb-2 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-28 w-28 [&_*]:scale-x-[-1]">
          <AvatarImage src={profile?.avatar_url} alt={profile?.username || 'User avatar'} />
          <AvatarFallback>
            {(profile?.username?.[0] || user.email?.[0] || '?').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-center sm:text-left">
            Hey {profile?.first_name || 'There'},
          </h1>
          <p className="text-muted-foreground mt-1 text-center sm:text-left">Track, analyze, and improve your trading performance</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full sm:w-auto self-center">
        {isSubscribed && (
          <Link to="/leaderboard">
            <Button 
              variant="outline" 
              className="w-full gap-2 bg-[#fff8e1] border-[#ffe57f] text-[#ff6f00] hover:bg-[#fff8e1] hover:text-[#ff6f00] hover:border-[#ffe57f]"
            >
              <Trophy className="h-4 w-4" />
              <span>Traders Leaderboard</span>
            </Button>
          </Link>
        )}
        <Button 
          variant="outline" 
          className="gap-2 bg-[#e5f0ff] border-[#e5f0ff] text-[#001d6c] hover:bg-[#e5f0ff] hover:text-[#001d6c] hover:border-[#e5f0ff]"
        >
          <Video className="h-4 w-4" />
          <span>Watch Journal Overview</span>
        </Button>
        <Button 
          variant="outline" 
          className="gap-2 bg-[#ffeaec] border-[#ffeaec] text-[#8f0527] hover:bg-[#ffeaec] hover:text-[#8f0527] hover:border-[#ffeaec]"
        >
          <Youtube className="h-4 w-4" />
          <span>Subscribe To Daily Shorts</span>
        </Button>
      </div>
    </header>
  );
}
