
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Infinity } from "lucide-react";

interface CreditsDisplayProps {
  credits?: {
    purchased_credits: number;
    total_credits_used: number;
  } | null;
  isLoading?: boolean;
}

export function CreditsDisplay({ credits, isLoading }: CreditsDisplayProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Analysis Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          AI Analysis Credits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Infinity className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold text-green-600">Unlimited</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              FREE
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Platform is now completely free! 
            {credits && (
              <span className="block mt-1">
                You've used {credits.total_credits_used} credits so far.
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
