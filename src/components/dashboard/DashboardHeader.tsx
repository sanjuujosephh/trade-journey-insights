
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video, Bell } from "lucide-react";

interface DashboardHeaderProps {
  profile: any;
  user: any;
}

export function DashboardHeader({ profile, user }: DashboardHeaderProps) {
  return (
    <header className="mb-8 flex flex-col items-center justify-center text-center gap-6">
      <div className="flex flex-col items-center gap-5">
        <Avatar className="h-20 w-20 ring-4 ring-primary/10 [&_*]:scale-x-[-1]">
          <AvatarImage src={profile?.avatar_url} alt={profile?.username || 'User avatar'} />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
            {(profile?.username?.[0] || user.email?.[0] || '?').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Hey {profile?.first_name || 'There'},
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Track, analyze, and improve your trading performance
          </p>
        </div>
      </div>
      
      <div className="flex gap-3 mt-2">
        <Button variant="outline" className="gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-300 transition-all duration-200">
          <Video className="h-4 w-4" />
          <span>Watch Journal Overview</span>
        </Button>
        <Button variant="outline" className="gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 border-pink-200 hover:border-pink-300 transition-all duration-200">
          <Bell className="h-4 w-4" />
          <span>Subscribe To Daily Shorts</span>
        </Button>
      </div>
    </header>
  );
}
