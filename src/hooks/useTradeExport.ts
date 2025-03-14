
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";

export function useTradeExport() {
  const { toast } = useToast();

  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('entry_time', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleExportCSV = () => {
    if (!trades.length) {
      toast({
        title: "No trades to export",
        description: "Add some trades first before exporting.",
        variant: "destructive"
      });
      return;
    }

    const csv = Papa.unparse(trades);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `trades_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Trades exported successfully!"
    });
  };

  return {
    handleExportCSV,
    hasTrades: trades.length > 0
  };
}
