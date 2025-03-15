
import { FormEvent } from "react";
import { FormData } from "@/types/trade";
import { TradeFormManager } from "./TradeFormManager";
import { useToast } from "@/hooks/use-toast";

interface TradeEntryFormProps {
  formData: FormData;
  editingId: string | null;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  handleSubmit: (e: FormEvent) => void;
  cancelEditing: () => void;
}

export function TradeEntryForm({
  formData,
  editingId,
  isSubmitting,
  handleChange,
  handleSelectChange,
  handleSubmit,
  cancelEditing
}: TradeEntryFormProps) {
  return (
    <TradeFormManager 
      formData={formData} 
      handleChange={handleChange} 
      handleSelectChange={handleSelectChange} 
      onSubmit={handleSubmit} 
      editingId={editingId}
      isSubmitting={isSubmitting} 
      onCancelEditing={cancelEditing}
    />
  );
}
