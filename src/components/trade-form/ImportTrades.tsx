
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";
import { Trade } from "@/types/trade";
import { cleanTimeFormat } from "@/utils/datetime";

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
            // Special handling for time fields to prevent database errors
            if (['entry_time', 'exit_time'].includes(header)) {
              // Store only HH:MM:SS format without AM/PM
              let timeValue = row[index];
              if (timeValue) {
                // Remove AM/PM indicators completely
                timeValue = timeValue.replace(/\s?[AP]M$/i, '').trim();
                
                // Ensure the time has seconds (HH:MM:SS)
                if (timeValue.split(':').length === 2) {
                  timeValue = `${timeValue}:00`;
                }
                
                // Type the empty string as null for the database
                trade[header] = timeValue || null;
              } else {
                trade[header] = null;
              }
            }
            // Handle date fields
            else if (['entry_date', 'exit_date'].includes(header)) {
              // Store dates as is - they'll be processed as strings
              trade[header] = row[index] || null;
            }
            // Convert numeric values
            else if (
              ['entry_price', 'exit_price', 'quantity', 'stop_loss', 'vix', 
               'call_iv', 'put_iv', 'confidence_level', 'strike_price',
               'emotional_score', 'confidence_level_score'].includes(header)
            ) {
              const num = parseFloat(row[index]);
              trade[header] = isNaN(num) ? null : num;
            } 
            // Handle the analysis_count as an integer
            else if (header === 'analysis_count') {
              const num = parseInt(row[index], 10);
              trade[header] = isNaN(num) ? 0 : num;
            }
            else {
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
      
      console.log('Processed trades ready for insertion:', processedTrades);
      
      // Insert trades one by one to better handle errors
      const results = [];
      const errors = [];
      
      for (const trade of processedTrades) {
        try {
          const { data, error } = await supabase
            .from('trades')
            .insert([trade]);
            
          if (error) {
            console.error('Error inserting trade:', error, trade);
            errors.push({ trade, error: error.message });
          } else {
            results.push(trade);
          }
        } catch (err) {
          console.error('Exception when inserting trade:', err);
          errors.push({ trade, error: err instanceof Error ? err.message : 'Unknown error' });
        }
      }
      
      if (errors.length > 0) {
        console.warn(`${errors.length} trades failed to import:`, errors);
        if (results.length === 0) {
          throw new Error(`All trades failed to import. First error: ${errors[0].error}`);
        }
      }
      
      return results;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: "Success",
        description: `${data.length} trades imported successfully!`
      });
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Failed to import trades: ${error.message}` 
          : "Failed to import trades. Please check your CSV format and try again.",
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
