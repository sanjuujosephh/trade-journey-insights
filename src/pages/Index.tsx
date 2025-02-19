
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradeEntry from "@/components/TradeEntry";
import Analytics from "@/components/Analytics";
import LearningCenter from "@/components/LearningCenter";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { Leaderboard } from "@/components/Leaderboard";
import { ProfileSettings } from "@/components/ProfileSettings";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function Index() {
  const [activeTab, setActiveTab] = useState("trade-entry");
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (!user) {
    return (
      <div className="container h-[calc(100vh-4rem)] py-4">
        <div className="grid h-full gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-6 text-2xl font-bold">Welcome to Trading Journal</h2>
            <AuthForm />
          </Card>
          <Card className="p-6">
            <h2 className="mb-6 text-2xl font-bold">Top Performers</h2>
            <Leaderboard />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div className="container h-full py-4">
        <header className="mb-2 flex items-center gap-4">
          <Avatar className="h-12 w-12">
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

        <Card className="h-[calc(100%-4.5rem)]">
          <Tabs defaultValue="trade-entry" className="h-full" onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b rounded-none px-6 bg-card">
              <TabsTrigger
                value="trade-entry"
                className="data-[state=active]:bg-background"
              >
                Trade Entry
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-background"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="learning"
                className="data-[state=active]:bg-background"
              >
                Learning Center
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-background"
              >
                Profile
              </TabsTrigger>
            </TabsList>
            
            <div className="h-[calc(100%-3rem)] overflow-y-auto">
              <TabsContent
                value="trade-entry"
                className="mt-0 h-full"
              >
                <TradeEntry />
              </TabsContent>

              <TabsContent
                value="analytics"
                className="mt-0 h-full"
              >
                <Analytics />
              </TabsContent>

              <TabsContent
                value="learning"
                className="mt-0 h-full"
              >
                <LearningCenter />
              </TabsContent>

              <TabsContent
                value="profile"
                className="mt-0 h-full p-6"
              >
                <ProfileSettings />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
