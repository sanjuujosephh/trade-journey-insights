
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarClock, Twitter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

// Create schema for form validation
const trialRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  followedTwitter: z.boolean().refine(val => val === true, {
    message: "Please follow @sanjuujosephh on Twitter"
  })
});

export function TrialRequestForm() {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [followedTwitter, setFollowedTwitter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If the user already has a subscription, don't show the trial form
  if (isSubscribed) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      trialRequestSchema.parse({ name, email, followedTwitter });
      
      setIsSubmitting(true);

      // Store the trial request in the database
      const { error } = await supabase.from('trial_requests').insert({
        name,
        email: email.toLowerCase(),
        user_id: user?.id, // Link to user if they're logged in
        twitter_followed: followedTwitter,
        status: 'pending' // Admin will need to review and approve
      });

      if (error) {
        console.error('Error submitting trial request:', error);
        if (error.code === '23505') { // Unique violation
          toast.error("You've already submitted a trial request");
        } else {
          toast.error("Failed to submit trial request. Please try again.");
        }
        return;
      }
      
      toast.success("Trial request submitted successfully! We'll review it shortly.");
      
      // Reset form
      setName("");
      setEmail("");
      setFollowedTwitter(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error('Trial request error:', error);
        toast.error("Failed to submit trial request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border rounded-lg shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold">30-Day Trial Request</CardTitle>
        <div className="mt-2 flex items-center">
          <CalendarClock className="h-5 w-5 mr-2 text-primary" />
          <span className="text-muted-foreground">Free Trial for 30 Days</span>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="twitter" 
              checked={followedTwitter} 
              onCheckedChange={(checked) => setFollowedTwitter(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="twitter" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have followed 
                <a 
                  href="https://twitter.com/sanjuujosephh" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline ml-1 inline-flex items-center"
                >
                  @sanjuujosephh
                  <Twitter className="h-3 w-3 ml-1" />
                </a>
              </Label>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          size="lg"
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Request Trial"}
        </Button>
      </CardFooter>
    </Card>
  );
}
