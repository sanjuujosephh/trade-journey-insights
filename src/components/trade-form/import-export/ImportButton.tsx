
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImportButtonProps {
  isProcessing: boolean;
  onUploadClick: () => void;
}

export function ImportButton({ isProcessing, onUploadClick }: ImportButtonProps) {
  return (
    <Button
      disabled={isProcessing}
      onClick={onUploadClick}
    >
      <Upload className="mr-2 h-4 w-4" />
      {isProcessing ? "Processing..." : "Upload CSV"}
    </Button>
  );
}
