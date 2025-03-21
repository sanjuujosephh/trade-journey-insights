
import { Utensils, BookOpenText } from "lucide-react";
import { Card } from "../ui/card";

export function PriceComparison() {
  return (
    <>
      <style>
        {`
          @keyframes shine {
            0% {
              background-position: -200% center;
            }
            100% {
              background-position: 200% center;
            }
          }
          
          .yearly-card {
            position: relative;
            z-index: 0;
          }
          
          .yearly-card::before {
            content: "";
            position: absolute;
            z-index: -1;
            inset: -2px;
            border-radius: 9px;
            background: linear-gradient(
              45deg, 
              #333333, #555555, #333333, #222222, #000000, #333333
            );
            background-size: 400% auto;
            animation: shine 4s linear infinite;
          }
        `}
      </style>
      <div className="bg-card p-6 shadow-sm rounded py-0 px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trading Journal Card */}
          <Card className="p-4 bg-gradient-to-br from-gray-50 to-white border-gray-200 overflow-hidden relative">
            <div className="flex items-center mb-3">
              <h4 className="font-medium">Onetradejournal</h4>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">Helps building habit that assists you for a lifetime.</p>
            
            {/* Price Display */}
            <div className="flex items-baseline mb-3">
              <span className="text-2xl font-bold text-primary">₹199</span>
              <span className="text-sm text-muted-foreground ml-1">per month</span>
            </div>
            
            <p className="text-xs text-gray-600 font-medium">Lasts a whole month 😱</p>
          </Card>
          
          {/* Burger Card */}
          <Card className="p-4 bg-gradient-to-br from-gray-50 to-white border-gray-200 overflow-hidden relative">
            <div className="flex items-center mb-3">
              <h4 className="font-medium">Crispy Burger</h4>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">A delicious treat that doesn't last more than 15-minutes.</p>
            
            {/* Price Display */}
            <div className="flex items-baseline mb-3">
              <span className="text-2xl font-bold text-gray-800">₹220</span>
              <span className="text-sm text-muted-foreground ml-1">for one-time</span>
            </div>
            
            <p className="text-xs text-gray-600 font-medium">Gone in minutes</p>
          </Card>
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Invest in your trading journey for less than the cost of a burger!</p>
        </div>
      </div>
    </>
  );
}
