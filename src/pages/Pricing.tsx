
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Free for Everyone
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Access all premium trading features at no cost
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Free Plan</CardTitle>
          <div className="text-4xl font-bold text-green-600">₹0</div>
          <p className="text-muted-foreground">Forever free</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              'Unlimited Trade Entries',
              'Advanced Analytics',
              'AI-Powered Trade Analysis', 
              'Behaviour Analysis',
              'Trading Strategies Access',
              'JOT Indicator Suite',
              'All Future Features'
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
