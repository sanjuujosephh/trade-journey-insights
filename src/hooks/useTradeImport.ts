
import { useFileUpload } from "./trade-import/useFileUpload";
import { useTemplateCSV } from "./trade-import/useTemplateCSV";

export function useTradeImport() {
  const { handleFileUpload, isProcessing } = useFileUpload();
  const { downloadTemplateCSV } = useTemplateCSV();

  return {
    handleFileUpload,
    isProcessing,
    downloadTemplateCSV
  };
}
