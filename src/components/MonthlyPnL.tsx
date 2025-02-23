
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { startOfMonth, endOfMonth } from "date-fns";
import { Card } from "@/components/ui/card";

export function MonthlyPnL() {
  const { user } = useAuth();
  const [monthlyPnL, setMonthlyPnL] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch initial monthly P&L
    const fetchMonthlyPnL = async () => {
      const currentDate = new Date();
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      const { data: trades, error } = await supabase
        .from('trades')
        .select('entry_price, exit_price, quantity')
        .gte('entry_time', monthStart.toISOString())
        .lte('entry_time', monthEnd.toISOString())
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching trades:', error);
        return;
      }

      const totalPnL = trades.reduce((sum, trade) => {
        if (trade.exit_price && trade.entry_price && trade.quantity) {
          return sum + ((trade.exit_price - trade.entry_price) * trade.quantity);
        }
        return sum;
      }, 0);

      setMonthlyPnL(totalPnL);
    };

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch P&L when trades change
          fetchMonthlyPnL();
        }
      )
      .subscribe();

    // Initial fetch
    fetchMonthlyPnL();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user || monthlyPnL === null) return null;

  return (
    <Card className="flex items-center px-4 py-2 border">
      <div>
        <div className="text-xs text-muted-foreground mb-1">Monthly P&L</div>
        <div className={`font-medium ${monthlyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ₹{monthlyPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </div>
      </div>
    </Card>
  );
}
