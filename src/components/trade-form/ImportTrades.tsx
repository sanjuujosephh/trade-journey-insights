
import { useTradeImport } from "@/hooks/useTradeImport";
import { useTradeExport } from "@/hooks/useTradeExport";
import { ImportButton } from "./import-export/ImportButton";
import { ExportButton } from "./import-export/ExportButton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function ImportTrades() {
  const { handleFileUpload, isProcessing } = useTradeImport();
  const { handleExportCSV, hasTrades } = useTradeExport();

  const handleUploadClick = () => {
    document.getElementById('csv-upload')?.click();
  };

  return (
    <Card className="mt-5 mb-[50px]">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Import/Export Trades</CardTitle>
        <CardDescription>
          Upload a CSV file with your trades or export your existing trades.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <ImportButton 
            isProcessing={isProcessing} 
            onUploadClick={handleUploadClick} 
          />
          <ExportButton onExportClick={handleExportCSV} />
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </CardContent>
    </Card>
  );
}
