
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { useImportMutation } from "./useImportMutation";

export function useFileUpload() {
  const { toast } = useToast();
  const { importMutation, isProcessing, setIsProcessing } = useImportMutation();

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

  return { handleFileUpload, isProcessing };
}
