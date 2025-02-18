import { useState, useEffect } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Trade {
  id: string;
  symbol: string;
  entry_price: number;
  exit_price?: number;
  quantity?: number;
  trade_type: string;
  stop_loss?: number;
  target?: number;
  strategy?: string;
  outcome: string;
  notes?: string;
  timestamp: string;
  user_id?: string;
}

const emptyFormData = {
  symbol: "",
  entry_price: "",
  exit_price: "",
  quantity: "",
  trade_type: "intraday",
  stop_loss: "",
  target: "",
  strategy: "",
  outcome: "profit",
  notes: "",
};

export default function TradeEntry() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(emptyFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error fetching trades:', error);
        throw error;
      }
      return data;
    },
  });

  const addTrade = useMutation({
    mutationFn: async (newTrade: Omit<Trade, 'id' | 'timestamp'>) => {
      const { data, error } = await supabase
        .from('trades')
        .insert([{ ...newTrade, user_id: userId }])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding trade:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: "Success",
        description: "Trade logged successfully!"
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to log trade. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateTrade = useMutation({
    mutationFn: async ({ id, ...trade }: Partial<Trade> & { id: string }) => {
      const { data, error } = await supabase
        .from('trades')
        .update({ ...trade, user_id: userId })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating trade:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: "Success",
        description: "Trade updated successfully!"
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update trade. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteTrade = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting trade:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: "Success",
        description: "Trade deleted successfully!"
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete trade. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to log trades.",
        variant: "destructive"
      });
      return;
    }
    
    const tradeData = {
      ...formData,
      entry_price: parseFloat(formData.entry_price),
      exit_price: formData.exit_price ? parseFloat(formData.exit_price) : null,
      quantity: formData.quantity ? parseFloat(formData.quantity) : null,
      stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : null,
      target: formData.target ? parseFloat(formData.target) : null,
    };
    
    try {
      if (editingId) {
        await updateTrade.mutateAsync({ id: editingId, ...tradeData });
        setEditingId(null);
      } else {
        await addTrade.mutateAsync(tradeData);
      }
      
      setFormData(emptyFormData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
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
    setFormData({
      symbol: trade.symbol,
      entry_price: trade.entry_price.toString(),
      exit_price: trade.exit_price?.toString() ?? "",
      quantity: trade.quantity?.toString() ?? "",
      trade_type: trade.trade_type,
      stop_loss: trade.stop_loss?.toString() ?? "",
      target: trade.target?.toString() ?? "",
      strategy: trade.strategy ?? "",
      outcome: trade.outcome,
      notes: trade.notes ?? "",
    });
    setEditingId(trade.id);
  };

  const handleDelete = async (id: string) => {
    await deleteTrade.mutateAsync(id);
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
                <Label htmlFor="entry_price">Entry Price</Label>
                <Input
                  id="entry_price"
                  name="entry_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.entry_price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exit_price">Exit Price</Label>
                <Input
                  id="exit_price"
                  name="exit_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.exit_price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stop_loss">Stop Loss</Label>
                <Input
                  id="stop_loss"
                  name="stop_loss"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.stop_loss}
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
              <Label htmlFor="trade_type">Trade Type</Label>
              <Select
                name="trade_type"
                value={formData.trade_type}
                onValueChange={(value) => handleSelectChange("trade_type", value)}
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
                    <TableCell>{new Date(trade.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>{trade.trade_type}</TableCell>
                    <TableCell>₹{trade.entry_price}</TableCell>
                    <TableCell>₹{trade.exit_price || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          trade.outcome === "profit"
                            ? "bg-green-100 text-green-800"
                            : trade.outcome === "loss"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
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
