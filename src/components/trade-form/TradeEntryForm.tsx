
import { FormEvent } from "react";
import { FormData } from "@/types/trade";
import { TradeFormManager } from "./TradeFormManager";
import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";

interface TradeEntryFormProps {
  formData: FormData;
  editingId: string | null;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  handleSubmit: (e: FormEvent) => void;
  cancelEditing: () => void;
  fillWithTestData?: () => void;
}

export function TradeEntryForm({
  formData,
  editingId,
  isSubmitting,
  handleChange,
  handleSelectChange,
  handleSubmit,
  cancelEditing,
  fillWithTestData
}: TradeEntryFormProps) {
  return (
    <>
      {fillWithTestData && (
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fillWithTestData}
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
          >
            <Beaker className="w-4 h-4 mr-2" />
            Fill with Test Data
          </Button>
        </div>
      )}
      <TradeFormManager 
        formData={formData} 
        handleChange={handleChange} 
        handleSelectChange={handleSelectChange} 
        onSubmit={handleSubmit} 
        editingId={editingId}
        isSubmitting={isSubmitting} 
        onCancelEditing={cancelEditing}
      />
    </>
  );
}
