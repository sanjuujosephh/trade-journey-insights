
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface Trade {
  id: string;
  symbol: string;
  entryPrice: string;
  exitPrice: string;
  quantity: string;
  tradeType: string;
  stopLoss: string;
  target: string;
  strategy: string;
  outcome: string;
  notes: string;
  timestamp: string;
}

const emptyFormData = {
  symbol: "",
  entryPrice: "",
  exitPrice: "",
  quantity: "",
  tradeType: "intraday",
  stopLoss: "",
  target: "",
  strategy: "",
  outcome: "profit",
  notes: "",
};

export default function TradeEntry() {
  const { toast } = useToast();
  const [formData, setFormData] = useState(emptyFormData);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing trade
      setTrades(trades.map(trade => 
        trade.id === editingId 
          ? { ...trade, ...formData, timestamp: trade.timestamp }
          : trade
      ));
      setEditingId(null);
      toast({
        title: "Success",
        description: "Trade updated successfully!"
      });
    } else {
      // Add new trade
      const newTrade = {
        ...formData,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
      };
      setTrades([newTrade, ...trades]);
      toast({
        title: "Success",
        description: "Trade logged successfully!"
      });
    }
    
    setFormData(emptyFormData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (trade: Trade) => {
    setFormData(trade);
    setEditingId(trade.id);
  };

  const handleDelete = (id: string) => {
    setTrades(trades.filter(trade => trade.id !== id));
    toast({
      title: "Success",
      description: "Trade deleted successfully!"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                placeholder="Enter stock symbol (e.g., RELIANCE)"
                value={formData.symbol}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price</Label>
                <Input
                  id="entryPrice"
                  name="entryPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.entryPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exitPrice">Exit Price</Label>
                <Input
                  id="exitPrice"
                  name="exitPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.exitPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss</Label>
                <Input
                  id="stopLoss"
                  name="stopLoss"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.stopLoss}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  name="target"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.target}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tradeType">Trade Type</Label>
              <Select
                name="tradeType"
                value={formData.tradeType}
                onValueChange={(value) => handleSelectChange("tradeType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trade type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intraday">Intraday</SelectItem>
                  <SelectItem value="swing">Swing</SelectItem>
                  <SelectItem value="options">Options</SelectItem>
                  <SelectItem value="futures">Futures</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Input
                id="strategy"
                name="strategy"
                placeholder="Enter trading strategy"
                value={formData.strategy}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Select
                name="outcome"
                value={formData.outcome}
                onValueChange={(value) => handleSelectChange("outcome", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profit">Profit</SelectItem>
                  <SelectItem value="loss">Loss</SelectItem>
                  <SelectItem value="breakeven">Breakeven</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add your trade notes..."
                value={formData.notes}
                onChange={handleChange}
                className="h-[100px]"
              />
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto">
            {editingId ? "Update Trade" : "Log Trade"}
          </Button>
        </div>
      </form>

      {trades.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Trade History</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>Exit</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{trade.timestamp}</TableCell>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>{trade.tradeType}</TableCell>
                    <TableCell>₹{trade.entryPrice}</TableCell>
                    <TableCell>₹{trade.exitPrice}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          trade.outcome === "profit"
                            ? "bg-success-DEFAULT/10 text-success-DEFAULT"
                            : trade.outcome === "loss"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted"
                        }`}
                      >
                        {trade.outcome}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(trade)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(trade.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
