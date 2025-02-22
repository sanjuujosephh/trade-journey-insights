import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { AvatarSection } from "./profile/AvatarSection";
import { PersonalInfoSection } from "./profile/PersonalInfoSection";
import { SocialMediaSection } from "./profile/SocialMediaSection";

type Profile = {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  twitter_id: string | null;
  telegram_id: string | null;
  avatar_url: string | null;
};

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
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
        .select("username, first_name, last_name, phone_number, twitter_id, telegram_id, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone_number: profile.phone_number,
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

  // Update profile state when data is fetched
  useState(() => {
    if (profileData) {
      setProfile(profileData);
    }
  });

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <AvatarSection
          userId={user.id}
          avatarUrl={profile.avatar_url}
          username={profile.username}
          email={user.email}
          refetch={refetch}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <PersonalInfoSection
            firstName={profile.first_name}
            lastName={profile.last_name}
            username={profile.username}
            phoneNumber={profile.phone_number}
            onChange={handleProfileChange}
          />

          <SocialMediaSection
            twitterId={profile.twitter_id}
            telegramId={profile.telegram_id}
            onChange={handleProfileChange}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
