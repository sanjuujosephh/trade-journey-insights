
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  onExportClick: () => void;
}

export function ExportButton({ onExportClick }: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onExportClick}
    >
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
