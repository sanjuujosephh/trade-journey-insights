
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AvatarSection } from "./AvatarSection";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { SocialMediaSection } from "./SocialMediaSection";

type Profile = {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  twitter_id: string | null;
  telegram_id: string | null;
  avatar_url: string | null;
};

interface ProfileFormProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  refetch: () => Promise<any>;
}

export function ProfileForm({ profile, setProfile, refetch }: ProfileFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile({ ...profile, [field]: value });
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

  if (!user) return null;

  return (
    <div className="rounded-lg bg-white p-6 border">
      <AvatarSection
        userId={user.id}
        avatarUrl={profile.avatar_url}
        username={profile.username}
        email={user.email}
        refetch={refetch}
      />

      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
