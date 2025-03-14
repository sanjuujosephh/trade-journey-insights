
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { processAndImportTrades } from "@/utils/csv/tradeDataProcessor";
import { AVAILABLE_SYMBOLS } from "@/constants/tradeConstants";

export function useTradeImport() {
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

  const downloadTemplateCSV = () => {
    // Create template headers
    const requiredHeaders = [
      "symbol", "entry_price", "exit_price", "quantity", "trade_type", 
      "entry_date", "entry_time", "exit_date", "exit_time"
    ];
    
    const optionalHeaders = [
      "stop_loss", "strategy", "outcome", "notes", "chart_link", "vix", 
      "call_iv", "put_iv", "strike_price", "option_type", "vwap_position", 
      "ema_position", "market_condition", "timeframe", "trade_direction", 
      "exit_reason", "entry_emotion", "exit_emotion"
    ];
    
    const allHeaders = [...requiredHeaders, ...optionalHeaders];
    
    // Create sample data row
    const sampleData = [
      AVAILABLE_SYMBOLS[0], // symbol
      "100.50", // entry_price
      "105.75", // exit_price
      "10", // quantity
      "options", // trade_type
      "01-06-2023", // entry_date (DD-MM-YYYY)
      "10:30", // entry_time (HH:MM)
      "01-06-2023", // exit_date
      "14:45", // exit_time
      "95.00", // stop_loss
      "breakout", // strategy
      "profit", // outcome
      "This is a sample trade", // notes
      "https://tradingview.com/chart/sample", // chart_link
      "15.5", // vix
      "30", // call_iv
      "28", // put_iv
      "100", // strike_price
      "call", // option_type
      "above_vwap", // vwap_position
      "above_20ema", // ema_position
      "trending", // market_condition
      "5min", // timeframe
      "long", // trade_direction
      "target", // exit_reason
      "confident", // entry_emotion
      "satisfied" // exit_emotion
    ];
    
    // Create instructions row
    const instructions = [
      "Required", // symbol
      "Required", // entry_price
      "Optional", // exit_price
      "Required", // quantity
      "Required: options, stocks, futures, forex, crypto", // trade_type
      "Required (DD-MM-YYYY)", // entry_date
      "Required (HH:MM)", // entry_time
      "Optional (DD-MM-YYYY)", // exit_date
      "Optional (HH:MM)", // exit_time
      "Optional", // stop_loss
      "Optional", // strategy
      "Optional: profit, loss, breakeven", // outcome
      "Optional", // notes
      "Optional: URL to chart image", // chart_link
      "Optional: volatility index", // vix
      "Optional: call implied volatility", // call_iv
      "Optional: put implied volatility", // put_iv
      "Optional: for options", // strike_price
      "Optional: call, put", // option_type
      "Optional: above_vwap, below_vwap", // vwap_position
      "Optional: above_20ema, below_20ema", // ema_position
      "Optional: trending, ranging, news_driven, volatile", // market_condition
      "Optional: 1min, 5min, 15min, 1hr", // timeframe
      "Optional: long, short", // trade_direction
      "Optional: stop_loss, target, manual, time_based", // exit_reason
      "Optional: fear, greed, fomo, revenge, neutral, confident", // entry_emotion
      "Optional: satisfied, regretful, relieved, frustrated" // exit_emotion
    ];
    
    // Create CSV content
    const csvContent = Papa.unparse({
      fields: allHeaders,
      data: [instructions, sampleData]
    });
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'trade_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded. Follow the instructions in the template for importing trades."
    });
  };

  return {
    handleFileUpload,
    isProcessing,
    downloadTemplateCSV
  };
}
