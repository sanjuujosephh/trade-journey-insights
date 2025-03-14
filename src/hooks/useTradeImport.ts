
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { processAndImportTrades } from "@/utils/csv/tradeDataProcessor";

export function useTradeImport() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const importMutation = useMutation({
    mutationFn: async (csvData: Array<Array<string>>) => {
      const { results, errors } = await processAndImportTrades(csvData);
      
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
        
        importMutation.mutate(results.data as Array<Array<string>>);
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

  return {
    handleFileUpload,
    isProcessing
  };
}
