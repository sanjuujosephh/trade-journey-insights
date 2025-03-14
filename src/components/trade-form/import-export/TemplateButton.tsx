
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface TemplateButtonProps {
  onDownloadClick: () => void;
}

export function TemplateButton({ onDownloadClick }: TemplateButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onDownloadClick}
    >
      <FileDown className="mr-2 h-4 w-4" />
      Download Template
    </Button>
  );
}
