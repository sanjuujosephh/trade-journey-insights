
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

type Profile = {
  username: string | null;
  twitter_id: string | null;
  telegram_id: string | null;
  avatar_url: string | null;
};

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({
    username: "",
    twitter_id: "",
    telegram_id: "",
    avatar_url: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { data: profileData, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("username, twitter_id, telegram_id, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          twitter_id: profile.twitter_id,
          telegram_id: profile.telegram_id,
        })
        .eq("id", user.id);

      if (error) throw error;

      await refetch();
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username || ""}
              onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter Username</Label>
            <Input
              id="twitter"
              value={profile.twitter_id || ""}
              onChange={(e) => setProfile(prev => ({ ...prev, twitter_id: e.target.value }))}
              placeholder="Enter your Twitter username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram Username</Label>
            <Input
              id="telegram"
              value={profile.telegram_id || ""}
              onChange={(e) => setProfile(prev => ({ ...prev, telegram_id: e.target.value }))}
              placeholder="Enter your Telegram username"
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
