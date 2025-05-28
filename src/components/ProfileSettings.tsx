
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoSection } from "./profile/PersonalInfoSection";
import { AvatarSection } from "./profile/AvatarSection";
import { SocialMediaSection } from "./profile/SocialMediaSection";
import { DisclaimerStatusSection } from "./profile/DisclaimerStatusSection";
import { FeedbackSection } from "./profile/FeedbackSection";
import { useToast } from "@/hooks/use-toast";

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      checkDisclaimerStatus();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkDisclaimerStatus = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("disclaimer_acceptances")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setHasAcceptedDisclaimer(true);
      }
    } catch (error) {
      console.error("Error checking disclaimer status:", error);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile((prev: any) => ({ ...prev, ...updates }));
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoSection 
            firstName={profile?.first_name || ""}
            lastName={profile?.last_name || ""}
            username={profile?.username || ""}
            phoneNumber={profile?.phone_number || ""}
            onChange={(field, value) => {
              const updates = { [field]: value };
              updateProfile(updates);
            }}
          />
        </TabsContent>

        <TabsContent value="avatar">
          <AvatarSection 
            userId={user?.id || ""}
            avatarUrl={profile?.avatar_url || ""}
            username={profile?.username || ""}
            email={user?.email || ""}
            refetch={fetchProfile}
          />
        </TabsContent>

        <TabsContent value="social">
          <SocialMediaSection 
            twitterId={profile?.twitter_id || ""}
            telegramId={profile?.telegram_id || ""}
            onChange={(field, value) => {
              const updates = { [field]: value };
              updateProfile(updates);
            }}
          />
        </TabsContent>

        <TabsContent value="feedback">
          <div className="space-y-6">
            <DisclaimerStatusSection hasAccepted={hasAcceptedDisclaimer} />
            <FeedbackSection />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
