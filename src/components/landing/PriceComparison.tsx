import { Utensils, BookOpenText } from "lucide-react";
import { Card } from "../ui/card";
export function PriceComparison() {
  return <div className="bg-card p-6 shadow-sm rounded py-0 px-0">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trading Journal Card */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-green-50 border-green-200 overflow-hidden relative">
          <div className="flex items-center mb-3">
            
            <h4 className="font-medium">Onetradejournal</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">Helps building habit that assists you for a lifetime.</p>
          
          {/* Price Display */}
          <div className="flex items-baseline mb-3">
            <span className="text-2xl font-bold text-primary">₹199</span>
            <span className="text-sm text-muted-foreground ml-1">per month</span>
          </div>
          
          {/* Progress Bar */}
          
          
          <p className="text-xs text-green-600 font-medium">Lasts a whole month 😱</p>
        </Card>
        
        {/* Burger Card */}
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 overflow-hidden relative">
          <div className="flex items-center mb-3">
            
            <h4 className="font-medium">Crispy Burger</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">A delicious treat that doesn't last more than 15-minutes.</p>
          
          {/* Price Display */}
          <div className="flex items-baseline mb-3">
            <span className="text-2xl font-bold text-orange-600">₹220</span>
            <span className="text-sm text-muted-foreground ml-1">for one-time</span>
          </div>
          
          {/* Progress Bar */}
          
          
          <p className="text-xs text-orange-600 font-medium">Gone in minutes</p>
        </Card>
      </div>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Invest in your trading journey for less than the cost of a burger!</p>
      </div>
    </div>;
}