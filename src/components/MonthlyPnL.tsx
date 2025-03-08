
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/formatCurrency";

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
      
      // Get the first day of the current month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      console.log("Fetching trades since:", firstDayOfMonth);
      
      // Fetch all completed trades (with exit prices) for the current user from the current month
      const { data: trades, error } = await supabase
        .from('trades')
        .select('entry_price, exit_price, quantity')
        .eq('user_id', user.id)
        .not('exit_price', 'is', null)
        .gte('timestamp', firstDayOfMonth);

      if (error) {
        console.error('Error fetching trades:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch P&L data"
        });
        return;
      }

      console.log(`Found ${trades?.length || 0} trades with exit prices for the current month`);
      
      if (!trades || trades.length === 0) {
        console.log("No completed trades found for this month");
        setMonthlyPnL(0);
        return;
      }

      // Calculate total P&L from all trades
      const totalPnL = trades.reduce((sum, trade) => {
        // Ensure we're working with numbers by explicitly parsing
        const entryPrice = parseFloat(String(trade.entry_price));
        const exitPrice = parseFloat(String(trade.exit_price));
        const quantity = parseFloat(String(trade.quantity));
        
        if (isNaN(entryPrice) || isNaN(exitPrice) || isNaN(quantity)) {
          console.log("Skipping trade with invalid numbers:", trade);
          return sum;
        }
        
        const tradePnL = (exitPrice - entryPrice) * quantity;
        console.log(`Trade P&L: ${tradePnL} (entry: ${entryPrice}, exit: ${exitPrice}, qty: ${quantity})`);
        
        return sum + tradePnL;
      }, 0);

      console.log('Total monthly P&L calculated:', totalPnL);
      setMonthlyPnL(totalPnL);
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
          {formatCurrency(monthlyPnL)}
        </span>
      </div>
    </Button>
  );
}
