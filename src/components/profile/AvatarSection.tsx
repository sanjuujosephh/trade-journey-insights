
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const AVATAR_STYLES = [
  { value: "avataaars", label: "Default" },
  { value: "bottts", label: "Robots" },
  { value: "pixel-art", label: "Pixel Art" },
  { value: "lorelei", label: "Lorelei" },
  { value: "adventurer", label: "Adventurer" },
  { value: "fun-emoji", label: "Fun Emoji" },
];

interface AvatarSectionProps {
  userId: string;
  avatarUrl: string | null;
  username: string | null;
  email: string | null;
  refetch: () => Promise<any>;
}

export function AvatarSection({ userId, avatarUrl, username, email, refetch }: AvatarSectionProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarStyle, setAvatarStyle] = useState("avataaars");

  const generateNewAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 15);
    return `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${seed}`;
  };

  const handleAvatarRefresh = async () => {
    setIsLoading(true);
    try {
      const newAvatarUrl = generateNewAvatar();
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", userId);

      if (error) throw error;

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

  const handleAvatarStyleChange = async (newStyle: string) => {
    setIsLoading(true);
    try {
      setAvatarStyle(newStyle);
      const newAvatarUrl = `https://api.dicebear.com/7.x/${newStyle}/svg?seed=${Math.random().toString(36).substring(2, 15)}`;
      
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", userId);

      if (error) throw error;

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
    <div className="mb-6 flex flex-col items-center gap-4">
      <Avatar className="h-28 w-28">
        <AvatarImage src={avatarUrl || ""} alt={username || "User avatar"} />
        <AvatarFallback>
          {(username?.[0] || email?.[0] || "?").toUpperCase()}
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
  );
}
