
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { processAndImportTrades } from "@/utils/csv/tradeDataProcessor";

export function useImportMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const importMutation = useMutation({
    mutationFn: async (csvData: Array<Array<string>>) => {
      const { results, errors } = await processAndImportTrades(csvData);
      
      if (errors.length > 0) {
        console.warn(`${errors.length} trades failed to import:`, errors);
        
        // Check for common date/time format errors
        const dateTimeErrors = errors.filter(e => 
          e.error.includes('date') || 
          e.error.includes('time') || 
          e.error.includes('timestamp')
        );
        
        if (dateTimeErrors.length > 0) {
          console.warn('Found date/time format errors:', dateTimeErrors);
        }
        
        if (results.length === 0) {
          throw new Error(`All trades failed to import. First error: ${errors[0].error}`);
        }
      }
      
      return {
        successful: results.length,
        failed: errors.length,
        firstError: errors.length > 0 ? errors[0].error : null,
        hasDateTimeErrors: errors.some(e => 
          e.error.includes('date') || 
          e.error.includes('time') || 
          e.error.includes('timestamp')
        )
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      
      if (data.failed > 0) {
        let description = `Imported ${data.successful} trades. ${data.failed} trades failed.`;
        
        if (data.hasDateTimeErrors) {
          description += ' Some entries had date/time format issues that couldn\'t be automatically corrected.';
        }
        
        if (data.firstError) {
          description += ` Error: ${data.firstError}`;
        }
        
        toast({
          title: "Partial Success",
          description,
          variant: data.successful > 0 ? "default" : "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: `${data.successful} trades imported successfully!`
        });
      }
      
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error('Import error:', error);
      
      let errorMessage = "Failed to import trades. Please check your CSV format and try again.";
      
      // Provide more specific guidance for date/time format issues
      if (error instanceof Error && 
          (error.message.includes('date') || 
           error.message.includes('time') || 
           error.message.includes('timestamp'))) {
        errorMessage = `Failed to import trades due to date/time format issues. Please ensure dates are in DD-MM-YYYY format and times are in HH:MM format. Error: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = `Failed to import trades: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  });

  return { importMutation, isProcessing, setIsProcessing };
}
