
import { useTradeForm } from "./useTradeForm";
import { useTradeOperations } from "./useTradeOperations";
import { useTradeSubmission } from "./useTradeSubmission";
import { useTradeActions } from "./useTradeActions";

export function useTradeManagement() {
  // Form state management
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

  // Trade data operations
  const {
    trades,
    isLoading,
    addTrade,
    updateTrade,
  } = useTradeOperations();

  // Trade submission
  const { submitTrade, isSubmitting } = useTradeSubmission({
    addTrade,
    updateTrade,
    resetForm
  });

  // UI actions
  const { handleEdit, handleView } = useTradeActions();

  // Close dialog handler
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitTrade(formData, editingId);
  };

  return {
    // Form state
    formData,
    editingId,
    selectedTrade,
    isDialogOpen,
    isSubmitting,
    
    // Data
    trades,
    isLoading,
    
    // State setters
    setSelectedTrade,
    setIsDialogOpen,
    setFormData,
    setEditingId,
    
    // Event handlers
    handleChange,
    handleSelectChange,
    handleSubmit,
    handleEdit,
    handleView,
    closeDialog
  };
}
