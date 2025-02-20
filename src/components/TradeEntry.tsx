import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Pencil, Trash2, Maximize2, Image } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TradeDetailsDialog } from "./TradeDetailsDialog";
import { Trade } from "@/types/trade";

const AVAILABLE_SYMBOLS = ["NIFTY", "BANKNIFTY"] as const;
const AVAILABLE_STRATEGIES = [
  "Trendline Breakout",
  "Trendline Breakdown",
  "Trendline Support",
  "Trendline Resistance",
  "Volume Area",
  "Fibonacci Retracement",
  "Channel Trading",
  "Support and Resistance Zones",
  "VWAP Reversion",
  "Breakout and Retest",
  "Volume Profile Analysis",
  "Price Action Trading",
  "Trend Following Strategy",
  "Liquidity Grab Strategy",
  "Fair Value Gap Strategy",
  "Breakout Fakeout Strategy"
] as const;

interface FormData {
  symbol: string;
  entry_price: string;
  exit_price: string;
  quantity: string;
  trade_type: string;
  stop_loss: string;
  strategy: string;
  outcome: 'profit' | 'loss' | 'breakeven';
  notes: string;
  entry_time: string;
  exit_time: string;
  chart_link: string;
  strike_price: string;
  option_type: string;
  market_condition: string;
  timeframe: string;
  trade_direction: string;
  planned_risk_reward: string;
  actual_risk_reward: string;
  planned_target: string;
  exit_reason: string;
  slippage: string;
  post_exit_price: string;
  exit_efficiency: string;
  confidence_level: string;
  entry_emotion: string;
  exit_emotion: string;
  followed_plan: boolean;
  plan_deviation_reason: string;
  is_fomo_trade: boolean;
  is_impulsive_exit: boolean;
}

const emptyFormData: FormData = {
  symbol: AVAILABLE_SYMBOLS[0],
  entry_price: "",
  exit_price: "",
  quantity: "",
  trade_type: "intraday",
  stop_loss: "",
  strategy: "",
  outcome: "profit",
  notes: "",
  entry_time: "",
  exit_time: "",
  chart_link: "",
  strike_price: "",
  option_type: "",
  market_condition: "",
  timeframe: "",
  trade_direction: "",
  planned_risk_reward: "",
  actual_risk_reward: "",
  planned_target: "",
  exit_reason: "",
  slippage: "",
  post_exit_price: "",
  exit_efficiency: "",
  confidence_level: "",
  entry_emotion: "",
  exit_emotion: "",
  followed_plan: true,
  plan_deviation_reason: "",
  is_fomo_trade: false,
  is_impulsive_exit: false,
};

export default function TradeEntry() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      
      if (error) throw error;
      return data;
    },
  });

  const checkTradeLimit = async (date: string) => {
    if (editingId) return true;
    
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    const { data: existingTrades, error } = await supabase
      .from('trades')
      .select('id')
      .gte('entry_time', dayStart.toISOString())
      .lte('entry_time', dayEnd.toISOString())
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error checking trade limit:', error);
      return false;
    }
    
    return (existingTrades?.length || 0) < 2;
  };

  const addTrade = useMutation({
    mutationFn: async (newTrade: Omit<Trade, 'id' | 'timestamp'>) => {
      const canAddTrade = await checkTradeLimit(newTrade.entry_time || new Date().toISOString());
      if (!canAddTrade) {
        throw new Error("Daily trade limit reached (2 trades per day)");
      }

      const { data, error } = await supabase
        .from('trades')
        .insert([{ ...newTrade, user_id: userId }])
        .select()
        .single();
      
      if (error) throw error;
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
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log trade. Please try again.",
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
      
      if (error) throw error;
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
      
      if (error) throw error;
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
      strike_price: formData.strike_price ? parseFloat(formData.strike_price) : null,
      entry_time: formData.entry_time || null,
      exit_time: formData.exit_time || null,
      followed_plan: Boolean(formData.followed_plan),
      is_fomo_trade: Boolean(formData.is_fomo_trade),
      is_impulsive_exit: Boolean(formData.is_impulsive_exit),
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (trade: Trade) => {
    setFormData({
      symbol: trade.symbol,
      entry_price: trade.entry_price.toString(),
      exit_price: trade.exit_price?.toString() ?? "",
      quantity: trade.quantity?.toString() ?? "",
      trade_type: trade.trade_type,
      stop_loss: trade.stop_loss?.toString() ?? "",
      strategy: trade.strategy ?? "",
      outcome: trade.outcome,
      notes: trade.notes ?? "",
      entry_time: trade.entry_time ? formatToLocalDateTime(trade.entry_time) : "",
      exit_time: trade.exit_time ? formatToLocalDateTime(trade.exit_time) : "",
      chart_link: trade.chart_link ?? "",
      strike_price: trade.strike_price?.toString() ?? "",
      option_type: trade.option_type ?? "",
      market_condition: trade.market_condition ?? "",
      timeframe: trade.timeframe ?? "",
      trade_direction: trade.trade_direction ?? "",
      planned_risk_reward: trade.planned_risk_reward?.toString() ?? "",
      actual_risk_reward: trade.actual_risk_reward?.toString() ?? "",
      planned_target: trade.planned_target?.toString() ?? "",
      exit_reason: trade.exit_reason ?? "",
      slippage: trade.slippage?.toString() ?? "",
      post_exit_price: trade.post_exit_price?.toString() ?? "",
      exit_efficiency: trade.exit_efficiency?.toString() ?? "",
      confidence_level: trade.confidence_level?.toString() ?? "",
      entry_emotion: trade.entry_emotion ?? "",
      exit_emotion: trade.exit_emotion ?? "",
      followed_plan: trade.followed_plan ?? true,
      plan_deviation_reason: trade.plan_deviation_reason ?? "",
      is_fomo_trade: trade.is_fomo_trade ?? false,
      is_impulsive_exit: trade.is_impulsive_exit ?? false,
    });
    setEditingId(trade.id);
  };

  const handleDelete = async (id: string) => {
    await deleteTrade.mutateAsync(id);
  };

  const formatToLocalDateTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  };

  const formatDisplayTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6 animate-fade-in h-full overflow-y-auto scrollbar-none pb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4 glass">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Select
                name="symbol"
                value={formData.symbol}
                onValueChange={(value) => handleSelectChange("symbol", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select symbol" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_SYMBOLS.map((symbol) => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trade_type">Trade Type</Label>
                <Select
                  name="trade_type"
                  value={formData.trade_type}
                  onValueChange={(value) => handleSelectChange("trade_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intraday">Intraday</SelectItem>
                    <SelectItem value="options">Options</SelectItem>
                    <SelectItem value="futures">Futures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trade_direction">Direction</Label>
                <Select
                  name="trade_direction"
                  value={formData.trade_direction}
                  onValueChange={(value) => handleSelectChange("trade_direction", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.trade_type === "options" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="strike_price">Strike Price</Label>
                  <Input
                    id="strike_price"
                    name="strike_price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.strike_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option_type">Option Type</Label>
                  <Select
                    name="option_type"
                    value={formData.option_type}
                    onValueChange={(value) => handleSelectChange("option_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="put">Put</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

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
                <Label htmlFor="entry_time">Entry Time</Label>
                <Input
                  id="entry_time"
                  name="entry_time"
                  type="datetime-local"
                  value={formData.entry_time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exit_time">Exit Time</Label>
                <Input
                  id="exit_time"
                  name="exit_time"
                  type="datetime-local"
                  value={formData.exit_time}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 glass">
            <div className="space-y-2">
              <Label htmlFor="market_condition">Market Condition</Label>
              <Select
                name="market_condition"
                value={formData.market_condition}
                onValueChange={(value) => handleSelectChange("market_condition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="ranging">Ranging</SelectItem>
                  <SelectItem value="news_driven">News Driven</SelectItem>
                  <SelectItem value="volatile">Volatile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select
                  name="timeframe"
                  value={formData.timeframe}
                  onValueChange={(value) => handleSelectChange("timeframe", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1min">1 min</SelectItem>
                    <SelectItem value="5min">5 min</SelectItem>
                    <SelectItem value="15min">15 min</SelectItem>
                    <SelectItem value="1hr">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confidence_level">Confidence Level</Label>
                <Select
                  name="confidence_level"
                  value={formData.confidence_level}
                  onValueChange={(value) => handleSelectChange("confidence_level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        {level}/5
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entry_emotion">Entry Emotion</Label>
                <Select
                  name="entry_emotion"
                  value={formData.entry_emotion}
                  onValueChange={(value) => handleSelectChange("entry_emotion", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="fear">Fear</SelectItem>
                    <SelectItem value="greed">Greed</SelectItem>
                    <SelectItem value="fomo">FOMO</SelectItem>
                    <SelectItem value="revenge">Revenge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exit_emotion">Exit Emotion</Label>
                <Select
                  name="exit_emotion"
                  value={formData.exit_emotion}
                  onValueChange={(value) => handleSelectChange("exit_emotion", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="fear">Fear</SelectItem>
                    <SelectItem value="greed">Greed</SelectItem>
                    <SelectItem value="fomo">FOMO</SelectItem>
                    <SelectItem value="revenge">Revenge</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="planned_target">Target</Label>
                <Input
                  id="planned_target"
                  name="planned_target"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.planned_target}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exit_reason">Exit Reason</Label>
              <Select
                name="exit_reason"
                value={formData.exit_reason}
                onValueChange={(value) => handleSelectChange("exit_reason", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="target">Hit Target</SelectItem>
                  <SelectItem value="stop_loss">Stop Loss</SelectItem>
                  <SelectItem value="manual">Manual Exit</SelectItem>
                  <SelectItem value="time_based">Time Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        <Card className="p-6 space-y-4 glass">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="followed_plan"
                checked={formData.followed_plan}
                onCheckedChange={(checked) => 
                  handleSelectChange("followed_plan", checked === true)
                }
              />
              <Label htmlFor="followed_plan">Followed Trading Plan</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_fomo_trade"
                checked={formData.is_fomo_trade}
                onCheckedChange={(checked) => 
                  handleSelectChange("is_fomo_trade", checked === true)
                }
              />
              <Label htmlFor="is_fomo_trade">FOMO Trade</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_impulsive_exit"
                checked={formData.is_impulsive_exit}
                onCheckedChange={(checked) => 
                  handleSelectChange("is_impulsive_exit", checked === true)
                }
              />
              <Label htmlFor="is_impulsive_exit">Impulsive Exit</Label>
            </div>
          </div>

          {!formData.followed_plan && (
            <div className="space-y-2">
              <Label htmlFor="plan_deviation_reason">Reason for Not Following Plan</Label>
              <Textarea
                id="plan_deviation_reason"
                name="plan_deviation_reason"
                value={formData.plan_deviation_reason}
                onChange={handleChange}
                placeholder="Why did you deviate from your trading plan?"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Trade Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add your trade notes..."
              className="h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chart_link">Chart Link</Label>
            <Input
              id="chart_link"
              name="chart_link"
              type="url"
              placeholder="TradingView chart link..."
              value={formData.chart_link}
              onChange={handleChange}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto">
            {editingId ? "Update Trade" : "Log Trade"}
          </Button>
        </div>
      </form>

      {trades.length > 0 && (
        <Card className="p-6 glass">
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
                  <TableHead>P/L</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>
                      {trade.entry_time 
                        ? new Date(trade.entry_time).toLocaleDateString()
                        : new Date(trade.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>{trade.trade_type}</TableCell>
                    <TableCell>
                      ₹{trade.entry_price}
                      {trade.entry_time && (
                        <div className="text-xs text-muted-foreground">
                          {formatDisplayTime(trade.entry_time)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {trade.exit_price ? (
                        <>
                          ₹{trade.exit_price}
                          {trade.exit_time && (
                            <div className="text-xs text-muted-foreground">
                              {formatDisplayTime(trade.exit_time)}
                            </div>
                          )}
                        </>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {trade.exit_price && trade.quantity
                        ? `₹${((Number(trade.exit_price) - Number(trade.entry_price)) * Number(trade.quantity)).toFixed(2)}`
                        : '-'}
                    </TableCell>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTrade(trade);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        {trade.chart_link && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(trade.chart_link, '_blank')}
                          >
                            <Image className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <TradeDetailsDialog
        trade={selectedTrade}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
