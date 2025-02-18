
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data - replace with real data later
const mistakes = [
  {
    id: 1,
    date: "2024-02-20",
    mistake: "Ignored stop loss",
    impact: "High",
    lesson: "Always stick to predefined stop loss levels",
  },
  {
    id: 2,
    date: "2024-02-19",
    mistake: "FOMO trade",
    impact: "Medium",
    lesson: "Wait for proper setup before entering",
  },
  {
    id: 3,
    date: "2024-02-18",
    mistake: "Overtrading",
    impact: "High",
    lesson: "Stick to daily trade limits",
  },
];

const patterns = [
  {
    pattern: "Early Exit",
    frequency: "High",
    suggestion: "Let profits run with trailing stop loss",
  },
  {
    pattern: "Averaging Down",
    frequency: "Medium",
    suggestion: "Avoid adding to losing positions",
  },
  {
    pattern: "Emotional Trading",
    frequency: "High",
    suggestion: "Follow trading plan strictly",
  },
];

export default function LearningCenter() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Recent Trading Mistakes</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Mistake</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Lesson Learned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mistakes.map((mistake) => (
                <TableRow key={mistake.id}>
                  <TableCell>{mistake.date}</TableCell>
                  <TableCell>{mistake.mistake}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        mistake.impact === "High"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {mistake.impact}
                    </span>
                  </TableCell>
                  <TableCell>{mistake.lesson}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Pattern Recognition</h3>
          <div className="space-y-4">
            {patterns.map((item) => (
              <div
                key={item.pattern}
                className="p-4 bg-muted rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.pattern}</span>
                  <span
                    className={`text-sm ${
                      item.frequency === "High"
                        ? "text-destructive"
                        : "text-warning"
                    }`}
                  >
                    {item.frequency} Frequency
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.suggestion}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Trading Rules</h3>
          <div className="space-y-4">
            {[
              "Never risk more than 1% per trade",
              "Always use stop loss orders",
              "No trading during first 15 minutes",
              "Follow your trading plan",
              "Document every trade",
            ].map((rule, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-muted rounded-lg"
              >
                <span className="mr-2 font-mono text-sm">{index + 1}.</span>
                {rule}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
