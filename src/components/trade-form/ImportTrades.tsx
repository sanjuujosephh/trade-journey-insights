
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";
import { Trade } from "@/types/trade";

export function ImportTrades() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const processTrades = useMutation({
    mutationFn: async (csvData: Array<Array<string>>) => {
      // Extract headers from the first row
      const headers = csvData[0];
      
      // Process the rows (skip header row)
      const processedTrades = csvData.slice(1).map(row => {
        const trade: Record<string, any> = {};
        
        // Map each cell to its corresponding header
        headers.forEach((header, index) => {
          if (header && row[index] !== undefined) {
            // Convert numeric values
            if (
              ['entry_price', 'exit_price', 'quantity', 'stop_loss', 'vix', 
               'call_iv', 'put_iv', 'confidence_level', 'strike_price'].includes(header)
            ) {
              const num = parseFloat(row[index]);
              trade[header] = isNaN(num) ? null : num;
            } else {
              trade[header] = row[index] || null;
            }
          }
        });
        
        // Add timestamp if not present
        if (!trade.timestamp) {
          trade.timestamp = new Date().toISOString();
        }
        
        return trade;
      }).filter(trade => trade.symbol && trade.entry_price); // Filter out incomplete rows
      
      // Insert processed trades directly
      const { data, error } = await supabase
        .from('trades')
        .insert(processedTrades);

      if (error) throw error;
      
      return processedTrades;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: "Success",
        description: "Trades imported successfully!"
      });
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Failed to import trades. Please check your CSV format and try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    Papa.parse(file, {
      complete: (results) => {
        console.log('Parsed CSV data:', results.data);
        
        if (!results.data.length || results.data.length < 2) {
          toast({
            title: "Error",
            description: "CSV file appears to be empty or missing headers.",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
        
        processTrades.mutate(results.data as Array<Array<string>>);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        toast({
          title: "Error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive"
        });
        setIsProcessing(false);
      }
    });
  };

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

  return (
    <div className="rounded-lg bg-card text-card-foreground shadow-sm p-6 mt-5 mb-[50px]">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-medium">Import/Export Trades</h3>
        <p className="text-sm text-muted-foreground text-center">
          Upload a CSV file with your trades or export your existing trades.
        </p>
        <div className="flex items-center gap-4">
          <Button
            disabled={isProcessing}
            onClick={() => document.getElementById('csv-upload')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Upload CSV"}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
}
