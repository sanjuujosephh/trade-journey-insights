
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { ProfileForm } from "./profile/ProfileForm";
import { SubscriptionInfoSection } from "./profile/SubscriptionInfoSection";
import { supabase } from "@/lib/supabase";
import { useSubscription } from "@/hooks/useSubscription";

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
  const [profile, setProfile] = useState<Profile>({
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    twitter_id: "",
    telegram_id: "",
    avatar_url: null,
  });

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

  // Use our useSubscription hook instead of the mock data
  const { subscription } = useSubscription();

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  // Ensure the page scrolls to the top when component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProfileForm
          profile={profile}
          setProfile={setProfile}
          refetch={refetch}
        />
        <SubscriptionInfoSection subscription={subscription} />
      </div>
    </div>
  );
}
