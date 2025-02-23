
import { useTradeForm } from "./useTradeForm";
import { useTradeOperations } from "./useTradeOperations";
import { transformTradeData } from "@/utils/trade-form/transformations";
import { useToast } from "@/hooks/use-toast";

export function useTradeManagement() {
  const { toast } = useToast();
  
  const {
    formData,
    editingId,
    selectedTrade,
    isDialogOpen,
    setSelectedTrade,
    setIsDialogOpen,
    setFormData,
    setEditingId,
    handleChange,
    handleSelectChange,
    resetForm,
  } = useTradeForm();

  const {
    trades,
    isLoading,
    addTrade,
    updateTrade,
  } = useTradeOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate date fields
    if (formData.entry_time) {
      try {
        const entryDate = new Date(formData.entry_time);
        if (isNaN(entryDate.getTime())) {
          toast({
            title: "Invalid Date",
            description: "Please enter a valid entry time",
            variant: "destructive"
          });
          return;
        }
      } catch (error) {
        toast({
          title: "Invalid Date",
          description: "Please enter a valid entry time",
          variant: "destructive"
        });
        return;
      }
    }

    if (formData.exit_time) {
      try {
        const exitDate = new Date(formData.exit_time);
        if (isNaN(exitDate.getTime())) {
          toast({
            title: "Invalid Date",
            description: "Please enter a valid exit time",
            variant: "destructive"
          });
          return;
        }
      } catch (error) {
        toast({
          title: "Invalid Date",
          description: "Please enter a valid exit time",
          variant: "destructive"
        });
        return;
      }
    }

    console.log('Submit form data:', formData);
    const tradeData = transformTradeData(formData);
    console.log('Transformed trade data:', tradeData);
    
    try {
      if (editingId) {
        console.log('Updating trade:', editingId, tradeData);
        await updateTrade.mutateAsync({ id: editingId, ...tradeData });
        resetForm();
      } else {
        console.log('Adding new trade:', tradeData);
        await addTrade.mutateAsync(tradeData);
        resetForm();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save trade",
        variant: "destructive"
      });
    }
  };

  return {
    formData,
    editingId,
    selectedTrade,
    isDialogOpen,
    trades,
    isLoading,
    setSelectedTrade,
    setIsDialogOpen,
    setFormData,
    setEditingId,
    handleChange,
    handleSelectChange,
    handleSubmit,
  };
}
