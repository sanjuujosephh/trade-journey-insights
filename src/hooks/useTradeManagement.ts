
import { useTradeForm } from "./useTradeForm";
import { useTradeOperations } from "./useTradeOperations";
import { useTradeSubmission } from "./useTradeSubmission";
import { useTradeActions } from "./useTradeActions";

export function useTradeManagement() {
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

  const { submitTrade } = useTradeSubmission({
    addTrade,
    updateTrade,
    resetForm
  });

  const { handleEdit, handleViewDetails, closeDialog } = useTradeActions({
    setFormData,
    setEditingId,
    setSelectedTrade,
    setIsDialogOpen,
    resetForm
  });

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
