
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart } from "lucide-react";

export function SubscriptionInfoSection() {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-700 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Platform Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-green-600">Current Plan:</span>
          <Badge className="bg-green-600 hover:bg-green-700">
            <Heart className="h-3 w-3 mr-1" />
            Free Forever
          </Badge>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-700 mb-2">🎉 Great News!</h4>
          <p className="text-green-600 text-sm">
            Our trading journal platform is now completely free for all users. 
            Enjoy unlimited access to all features including AI trade analysis!
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-green-600">AI Analysis:</span>
            <span className="font-medium text-green-700">Unlimited</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">Trade Storage:</span>
            <span className="font-medium text-green-700">Unlimited</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">Advanced Analytics:</span>
            <span className="font-medium text-green-700">Included</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
