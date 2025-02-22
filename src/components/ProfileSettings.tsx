
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw } from "lucide-react";

type Profile = {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  twitter_id: string | null;
  telegram_id: string | null;
  avatar_url: string | null;
};

const AVATAR_STYLES = [
  { value: "avataaars", label: "Default" },
  { value: "bottts", label: "Robots" },
  { value: "pixel-art", label: "Pixel Art" },
  { value: "lorelei", label: "Lorelei" },
  { value: "adventurer", label: "Adventurer" },
  { value: "fun-emoji", label: "Fun Emoji" },
];

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
  const [avatarStyle, setAvatarStyle] = useState("avataaars");
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

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
      const currentUrl = profileData.avatar_url || "";
      const styleMatch = currentUrl.match(/\/([^/]+)\/svg/);
      if (styleMatch && AVATAR_STYLES.some(s => s.value === styleMatch[1])) {
        setAvatarStyle(styleMatch[1]);
      }
    }
  }, [profileData]);

  const generateNewAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 15);
    return `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${seed}`;
  };

  const handleAvatarRefresh = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const newAvatarUrl = generateNewAvatar();
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", user.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));
      await refetch();
      
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar",
        variant: "destructive",
      });
      console.error("Error updating avatar:", error);
    } finally {
      setIsLoading(false);
    }
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

  const handleAvatarStyleChange = async (newStyle: string) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      setAvatarStyle(newStyle);
      const newAvatarUrl = `https://api.dicebear.com/7.x/${newStyle}/svg?seed=${Math.random().toString(36).substring(2, 15)}`;
      
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", user.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));
      await refetch();
      
      toast({
        title: "Success",
        description: "Avatar style updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar style",
        variant: "destructive",
      });
      console.error("Error updating avatar style:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="mb-6 flex flex-col items-center gap-4">
          <Avatar className="h-28 w-28">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.username || "User avatar"} />
            <AvatarFallback>
              {(profile.username?.[0] || user?.email?.[0] || "?").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-4 w-full max-w-xs">
            <Select value={avatarStyle} onValueChange={handleAvatarStyleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select avatar style" />
              </SelectTrigger>
              <SelectContent>
                {AVATAR_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleAvatarRefresh}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.first_name || ""}
                onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.last_name || ""}
                onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Enter your last name"
              />
            </div>
          </div>

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
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={profile.phone_number || ""}
              onChange={(e) => setProfile(prev => ({ ...prev, phone_number: e.target.value }))}
              placeholder="Enter your phone number"
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
