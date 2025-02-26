import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AvatarSection } from "./profile/AvatarSection";
import { PersonalInfoSection } from "./profile/PersonalInfoSection";
import { SocialMediaSection } from "./profile/SocialMediaSection";
import { CalendarDays, CreditCard } from "lucide-react";
import { format } from "date-fns";

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

  const { data: subscription } = useQuery<Subscription>({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      // For testing purposes, return mock subscription data
      return {
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        razorpay_subscription_id: 'sub_test_123456',
      };
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

  useState(() => {
    if (profileData) {
      setProfile(profileData);
    }
  });

  if (!user) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const getStatusBadgeColor = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information Column */}
        <div className="space-y-6">
          <div className="rounded-lg bg-card text-card-foreground shadow-sm p-6">
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
          </div>
        </div>

        {/* Subscription Information Column */}
        <div className="rounded-lg bg-card text-card-foreground shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Information
          </h2>

          <div className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Subscription Status</div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeColor(subscription?.status)}`}>
                {subscription?.status || "No active subscription"}
              </span>
            </div>

            {subscription?.razorpay_subscription_id && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Subscription ID</div>
                <div className="font-mono text-sm">{subscription.razorpay_subscription_id}</div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="grid gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <CalendarDays className="h-4 w-4" />
                    Current Period
                  </div>
                  <div className="text-sm">
                    {formatDate(subscription?.current_period_start)} - {formatDate(subscription?.current_period_end)}
                  </div>
                </div>
              </div>
            </div>

            {subscription?.status === "active" && (
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => window.open("https://dashboard.razorpay.com/subscriptions", "_blank")}
              >
                Manage Subscription
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
