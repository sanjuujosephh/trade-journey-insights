
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";

export function ImportTrades() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const processTrades = useMutation({
    mutationFn: async (csvData: string[][]) => {
      const { data, error } = await supabase.functions.invoke('process-trades', {
        body: { trades: csvData }
      });

      if (error) throw error;
      
      // Insert the processed trades
      const { error: insertError } = await supabase
        .from('trades')
        .insert(data.trades);

      if (insertError) throw insertError;
      
      return data.trades;
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
        description: "Failed to import trades. Please check your CSV format.",
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
        processTrades.mutate(results.data);
      },
      error: () => {
        toast({
          title: "Error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive"
        });
        setIsProcessing(false);
      }
    });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-medium">Import Trades</h3>
        <p className="text-sm text-muted-foreground text-center">
          Upload a CSV file with your trades. Our AI will analyze and import them automatically.
        </p>
        <div className="flex items-center gap-4">
          <Button
            disabled={isProcessing}
            onClick={() => document.getElementById('csv-upload')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Upload CSV"}
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
    </Card>
  );
}
