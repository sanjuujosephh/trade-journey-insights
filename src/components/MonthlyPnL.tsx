
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { startOfMonth, endOfMonth, format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { dateToISTString } from "@/utils/datetime";

export function MonthlyPnL() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [monthlyPnL, setMonthlyPnL] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const calculateMonthlyPnL = async () => {
    if (!user) return;
    setIsRefreshing(true);

    try {
      console.log("Calculating monthly P&L for user:", user.id);
      
      // Fetch all completed trades (with exit prices) for the current user
      const { data: trades, error } = await supabase
        .from('trades')
        .select('entry_price, exit_price, quantity')
        .eq('user_id', user.id)
        .not('exit_price', 'is', null);

      if (error) {
        console.error('Error fetching trades:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch P&L data"
        });
        return;
      }

      console.log(`Found ${trades?.length || 0} trades with exit prices`);
      
      if (!trades || trades.length === 0) {
        console.log("No completed trades found");
        setMonthlyPnL(0);
        return;
      }

      // Calculate total P&L from all trades
      const totalPnL = trades.reduce((sum, trade) => {
        // Ensure we're working with numbers
        const entryPrice = Number(trade.entry_price);
        const exitPrice = Number(trade.exit_price);
        const quantity = Number(trade.quantity);
        
        if (isNaN(entryPrice) || isNaN(exitPrice) || isNaN(quantity)) {
          console.log("Skipping trade with invalid numbers:", trade);
          return sum;
        }
        
        const tradePnL = (exitPrice - entryPrice) * quantity;
        console.log(`Trade P&L: ${tradePnL} (entry: ${entryPrice}, exit: ${exitPrice}, qty: ${quantity})`);
        
        return sum + tradePnL;
      }, 0);

      setMonthlyPnL(totalPnL);
      console.log('Monthly P&L updated:', totalPnL);
    } catch (err) {
      console.error('Error calculating P&L:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to calculate P&L"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    calculateMonthlyPnL();

    const channel = supabase
      .channel('trades-pnl')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Received trade change:', payload);
          calculateMonthlyPnL();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleRefresh = async () => {
    if (!isRefreshing) {
      await calculateMonthlyPnL();
      toast({
        title: "Refreshed",
        description: "P&L data has been updated"
      });
    }
  };

  if (!user || monthlyPnL === null) return null;

  return (
    <Button 
      variant="outline" 
      className="h-10 min-w-[4rem] px-2 flex items-center justify-center border rounded bg-background"
      onClick={handleRefresh}
      disabled={isRefreshing}
    >
      <div className="flex flex-col items-center justify-center text-center w-full leading-none">
        <span className="text-[10px] text-foreground">P&L</span>
        <span className={`text-sm ${monthlyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ₹{monthlyPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </span>
      </div>
    </Button>
  );
}
