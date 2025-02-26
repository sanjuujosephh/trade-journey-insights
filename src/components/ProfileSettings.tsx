
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { ProfileForm } from "./profile/ProfileForm";
import { SubscriptionInfoSection } from "./profile/SubscriptionInfoSection";

type Profile = {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  twitter_id: string | null;
  telegram_id: string | null;
  avatar_url: string | null;
};

type Subscription = {
  status: 'active' | 'canceled' | 'paused' | 'expired';
  current_period_start: string | null;
  current_period_end: string | null;
  razorpay_subscription_id: string | null;
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

  const { data: subscription } = useQuery<Subscription>({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      // For testing purposes, return mock subscription data
      return {
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        razorpay_subscription_id: 'sub_test_123456',
      };
    },
    enabled: !!user?.id,
  });

  useState(() => {
    if (profileData) {
      setProfile(profileData);
    }
  });

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
