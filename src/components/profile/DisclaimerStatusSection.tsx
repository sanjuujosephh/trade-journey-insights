
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle2 } from "lucide-react";

interface DisclaimerStatusSectionProps {
  hasAccepted: boolean;
}

export function DisclaimerStatusSection({ hasAccepted }: DisclaimerStatusSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-md font-medium">Disclaimer Status</h3>
      
      <Alert variant="outline" className="bg-muted/40">
        <div className="flex items-center gap-2">
          {hasAccepted ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertDescription className="text-sm">
                You have accepted our disclaimer. This acceptance is mandatory for using Onetradejournal.
              </AlertDescription>
            </>
          ) : (
            <>
              <Shield className="h-5 w-5 text-amber-500" />
              <AlertDescription className="text-sm">
                Disclaimer acceptance is required. You will be prompted to accept it when you log in.
              </AlertDescription>
            </>
          )}
        </div>
      </Alert>
    </div>
  );
}
