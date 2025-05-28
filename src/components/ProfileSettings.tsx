
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoSection } from "./profile/PersonalInfoSection";
import { AvatarSection } from "./profile/AvatarSection";
import { SocialMediaSection } from "./profile/SocialMediaSection";
import { SubscriptionInfoSection } from "./profile/SubscriptionInfoSection";
import { DisclaimerStatusSection } from "./profile/DisclaimerStatusSection";
import { FeedbackSection } from "./profile/FeedbackSection";
import { useToast } from "@/hooks/use-toast";

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoSection 
            profile={profile} 
            onUpdateProfile={updateProfile} 
          />
        </TabsContent>

        <TabsContent value="avatar">
          <AvatarSection 
            profile={profile} 
            onUpdateProfile={updateProfile} 
          />
        </TabsContent>

        <TabsContent value="social">
          <SocialMediaSection 
            profile={profile} 
            onUpdateProfile={updateProfile} 
          />
        </TabsContent>

        <TabsContent value="account">
          <div className="space-y-6">
            <SubscriptionInfoSection />
            <DisclaimerStatusSection />
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
