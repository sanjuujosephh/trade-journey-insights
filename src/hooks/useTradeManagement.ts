
import { useTradeForm } from "./useTradeForm";
import { useTradeOperations } from "./useTradeOperations";
import { useTradeSubmission } from "./useTradeSubmission";
import { useTradeActions } from "./useTradeActions";
import { useTradeValidation } from "./useTradeValidation";

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

  // Form validation
  const { validateForm } = useTradeValidation();

  // Trade submission
  const { submitTrade } = useTradeSubmission({
    addTrade,
    updateTrade,
    resetForm,
    validateForm
  });

  // UI actions
  const { handleEdit, handleViewDetails, closeDialog } = useTradeActions({
    setFormData,
    setEditingId,
    setSelectedTrade,
    setIsDialogOpen,
    resetForm
  });

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
    handleViewDetails,
    closeDialog
  };
}
