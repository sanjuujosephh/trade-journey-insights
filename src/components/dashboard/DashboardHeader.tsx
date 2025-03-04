
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video, Bell } from "lucide-react";

interface DashboardHeaderProps {
  profile: any;
  user: any;
}

export function DashboardHeader({ profile, user }: DashboardHeaderProps) {
  return (
    <header className="mb-6 flex flex-col items-center text-center">
      <div className="flex flex-col items-center gap-4 mb-5">
        <Avatar className="h-24 w-24 [&_*]:scale-x-[-1]">
          <AvatarImage src={profile?.avatar_url} alt={profile?.username || 'User avatar'} />
          <AvatarFallback className="text-xl">
            {(profile?.username?.[0] || user.email?.[0] || '?').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Hey {profile?.first_name || 'There'},
          </h1>
          <p className="text-muted-foreground mt-1">Track, analyze, and improve your trading performance</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-2 w-full max-w-md">
        <Button 
          variant="outline" 
          className="gap-2 bg-[#FFDEE2] hover:bg-[#FFDEE2]/80 border-[#FFDEE2] text-gray-700 flex-1"
        >
          <Video className="h-4 w-4" />
          <span>Watch Journal Overview</span>
        </Button>
        <Button 
          variant="outline" 
          className="gap-2 bg-[#D3E4FD] hover:bg-[#D3E4FD]/80 border-[#D3E4FD] text-gray-700 flex-1"
        >
          <Bell className="h-4 w-4" />
          <span>Subscribe To Daily Shorts</span>
        </Button>
      </div>
    </header>
  );
}
