import { Beef, BookOpenText } from "lucide-react";
import { Card } from "../ui/card";
export function PriceComparison() {
  return <div className="bg-card border p-6 shadow-sm rounded">
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trading Journal Card */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-green-50 border-green-200 overflow-hidden relative">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <BookOpenText className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-medium">Trading Journal</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Manage your trades and track performance efficiently
          </p>
          
          {/* Price Display */}
          <div className="flex items-baseline mb-3">
            <span className="text-2xl font-bold text-primary">₹199</span>
            <span className="text-sm text-muted-foreground ml-1">/month</span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-green-500 rounded-full" style={{
            width: '99.5%'
          }}></div>
          </div>
          
          <p className="text-xs text-green-600 font-medium">Lasts a whole month 😱</p>
        </Card>
        
        {/* Burger Card */}
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 overflow-hidden relative">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-orange-100 mr-3">
              <Beef className="h-6 w-6 text-orange-600" />
            </div>
            <h4 className="font-medium">Crispy Burger</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            A delicious treat that comes at a slightly higher price
          </p>
          
          {/* Price Display */}
          <div className="flex items-baseline mb-3">
            <span className="text-2xl font-bold text-orange-600">₹200</span>
            <span className="text-sm text-muted-foreground ml-1">/each</span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-orange-500 rounded-full" style={{
            width: '100%'
          }}></div>
          </div>
          
          <p className="text-xs text-orange-600 font-medium">Gone in minutes</p>
        </Card>
      </div>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Invest in your trading journey for less than the cost of a burger!</p>
      </div>
    </div>;
}