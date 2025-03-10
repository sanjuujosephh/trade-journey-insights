
import { Check } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ComparisonTableSection() {
  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How We Compare</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See why onetradejournal is the best choice for serious traders
          </p>
        </div>
        
        <div className="overflow-x-auto max-w-4xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-1/3">Features</TableHead>
                <TableHead className="text-center w-1/3">OneTradeJournal</TableHead>
                <TableHead className="text-center w-1/3">Others</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Starting Price</TableCell>
                <TableCell className="text-center">₹199/month</TableCell>
                <TableCell className="text-center">₹999/month+</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Habit Building System</TableCell>
                <TableCell className="text-center text-green-600"><Check className="inline h-5 w-5" /></TableCell>
                <TableCell className="text-center text-muted-foreground">Limited or None</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">AI Analysis</TableCell>
                <TableCell className="text-center text-green-600"><Check className="inline h-5 w-5" /></TableCell>
                <TableCell className="text-center text-muted-foreground">Rare or Premium Only</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Options Trading Support</TableCell>
                <TableCell className="text-center text-green-600"><Check className="inline h-5 w-5" /></TableCell>
                <TableCell className="text-center text-muted-foreground">Limited or Premium Only</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Community Features</TableCell>
                <TableCell className="text-center text-green-600"><Check className="inline h-5 w-5" /></TableCell>
                <TableCell className="text-center text-muted-foreground">Limited or None</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Learning Resources</TableCell>
                <TableCell className="text-center text-green-600"><Check className="inline h-5 w-5" /></TableCell>
                <TableCell className="text-center text-muted-foreground">Limited or Premium Only</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Trade Import</TableCell>
                <TableCell className="text-center text-green-600"><Check className="inline h-5 w-5" /></TableCell>
                <TableCell className="text-center text-green-600"><Check className="inline h-5 w-5" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
