
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Maximize2, Image, Pencil, Filter, Search, X } from "lucide-react";
import { Trade } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TradeHistoryProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onViewDetails: (trade: Trade) => void;
  showEditButton?: boolean;
}

export function TradeHistory({ trades, onEdit, onDelete, onViewDetails, showEditButton = false }: TradeHistoryProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState<string>("");
  const [symbolFilter, setSymbolFilter] = useState<string>("");
  const [tradeTypeFilter, setTradeTypeFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique symbols for filter dropdown
  const uniqueSymbols = Array.from(new Set(trades.map(trade => trade.symbol))).sort();
  
  // Filter trades based on search term and filters
  const filteredTrades = trades.filter(trade => {
    // Search term filtering (case insensitive)
    const matchesSearch = !searchTerm || 
      trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trade.notes && trade.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Outcome filtering
    const matchesOutcome = !outcomeFilter || trade.outcome === outcomeFilter;
    
    // Symbol filtering
    const matchesSymbol = !symbolFilter || trade.symbol === symbolFilter;
    
    // Trade type filtering
    const matchesTradeType = !tradeTypeFilter || trade.trade_type === tradeTypeFilter;
    
    return matchesSearch && matchesOutcome && matchesSymbol && matchesTradeType;
  });

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    const dateA = a.entry_date ? new Date(a.entry_date.split('-').reverse().join('-')) : new Date(0);
    const dateB = b.entry_date ? new Date(b.entry_date.split('-').reverse().join('-')) : new Date(0);
    
    const dateDiff = dateB.getTime() - dateA.getTime();
    
    if (dateDiff !== 0) return dateDiff;
    
    const timeA = a.entry_time || "";
    const timeB = b.entry_time || "";
    return timeB.localeCompare(timeA);
  });

  const resetFilters = () => {
    setSearchTerm("");
    setOutcomeFilter("");
    setSymbolFilter("");
    setTradeTypeFilter("");
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared"
    });
  };

  const formatDisplayTime = (time: string | null) => {
    if (!time) return "";
    return time;
  };

  const formatDisplayDate = (date: string | null) => {
    if (!date) return "";
    return date;
  };

  const calculatePnL = (trade: Trade) => {
    if (!trade.exit_price || !trade.entry_price || !trade.quantity) return null;
    return (trade.exit_price - trade.entry_price) * trade.quantity;
  };

  const formatPnL = (pnl: number | null) => {
    if (pnl === null) return '-';
    return `₹${pnl.toFixed(2)}`;
  };

  const getOutcomeStyle = (pnl: number | null) => {
    if (pnl === null) return 'bg-gray-100 text-gray-800';
    if (pnl > 0) return 'bg-green-100 text-green-800';
    if (pnl < 0) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getOutcomeText = (pnl: number | null) => {
    if (pnl === null) return 'Pending';
    if (pnl > 0) return 'Profit';
    if (pnl < 0) return 'Loss';
    return 'Breakeven';
  };

  const handleDelete = async (id: string) => {
    try {
      // Call the parent's onDelete function
      onDelete(id);
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 glass">
      <div className="mb-4 space-y-4">
        {/* Search and Filter UI */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto flex-1">
            <Input
              placeholder="Search by symbol or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {(outcomeFilter || symbolFilter || tradeTypeFilter) && (
                  <span className="bg-primary h-2 w-2 rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Trades</h4>
                
                <div className="grid gap-2">
                  <Label htmlFor="symbolFilter">Symbol</Label>
                  <Select value={symbolFilter} onValueChange={setSymbolFilter}>
                    <SelectTrigger id="symbolFilter">
                      <SelectValue placeholder="Any Symbol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Symbol</SelectItem>
                      {uniqueSymbols.map(symbol => (
                        <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="outcomeFilter">Outcome</Label>
                  <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
                    <SelectTrigger id="outcomeFilter">
                      <SelectValue placeholder="Any Outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Outcome</SelectItem>
                      <SelectItem value="profit">Profit</SelectItem>
                      <SelectItem value="loss">Loss</SelectItem>
                      <SelectItem value="breakeven">Breakeven</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tradeTypeFilter">Trade Type</Label>
                  <Select value={tradeTypeFilter} onValueChange={setTradeTypeFilter}>
                    <SelectTrigger id="tradeTypeFilter">
                      <SelectValue placeholder="Any Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Type</SelectItem>
                      <SelectItem value="options">Options</SelectItem>
                      <SelectItem value="futures">Futures</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {sortedTrades.length} of {trades.length} trades
          {(outcomeFilter || symbolFilter || tradeTypeFilter || searchTerm) && (
            <Button variant="link" className="px-1 py-0 h-auto font-normal" onClick={resetFilters}>
              Clear all filters
            </Button>
          )}
        </div>
      </div>
      
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
            {sortedTrades.length > 0 ? (
              sortedTrades.map((trade) => {
                const pnl = calculatePnL(trade);
                return (
                  <TableRow key={trade.id}>
                    <TableCell>
                      {formatDisplayDate(trade.entry_date)}
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
                      {formatPnL(pnl)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded-[3px] text-xs ${getOutcomeStyle(pnl)}`}
                      >
                        {getOutcomeText(pnl)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {showEditButton && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(trade)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
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
                          onClick={() => onViewDetails(trade)}
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
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No trades match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
