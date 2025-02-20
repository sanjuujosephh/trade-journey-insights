
import { Card } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade } from "@/types/trade";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIAnalysisPanel } from "./AIAnalysisPanel";
import { TimePerformanceHeatmap } from "./analytics/TimePerformanceHeatmap";
import { IntradayRiskMetrics } from "./analytics/IntradayRiskMetrics";
import { TradeFlowChart } from "./analytics/TradeFlowChart";
import { FOTradeTable } from "./analytics/FOTradeTable";
import { TradingCalendar } from "./analytics/TradingCalendar";
import { useState } from "react";
import { calculateStats } from "@/utils/tradeCalculations";
import { ErrorBoundary } from "./ErrorBoundary";
import { LoadingSpinner } from "./LoadingSpinner";

interface AIAnalysisResponse {
  analysis: string;
}

export default function Analytics() {
  const { toast } = useToast();
  const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>("");

  const { data: trades = [], isLoading: isLoadingTrades, error: tradesError } = useQuery<Trade[]>({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { mutate: analyzeTradesWithAI, isPending: isAnalyzing } = useMutation({
    mutationFn: async (): Promise<AIAnalysisResponse> => {
      const response = await supabase.functions.invoke('analyze-trades', {
        body: { trades }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to analyze trades');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      setCurrentAnalysis(data.analysis);
      setIsAnalysisPanelOpen(true);
      toast({
        title: "Analysis Complete",
        description: "AI analysis is ready for review",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Could not complete the AI analysis. Please try again.",
        variant: "destructive",
      });
      console.error('AI Analysis error:', error);
    },
  });

  if (isLoadingTrades) return <LoadingSpinner />;
  
  if (tradesError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading trades</AlertTitle>
          <AlertDescription>
            {tradesError instanceof Error ? tradesError.message : 'Failed to load trades'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const stats = calculateStats(trades);

  return (
    <ErrorBoundary>
      <div className="h-full p-6">
        <Tabs defaultValue="performance" className="h-full space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="performance">Trade Performance</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="analysis">Trade Analysis</TabsTrigger>
              <TabsTrigger value="history">Trade History</TabsTrigger>
            </TabsList>
            
            <Button
              onClick={() => analyzeTradesWithAI()}
              disabled={isAnalyzing || trades.length === 0}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Today's Trades...
                </>
              ) : (
                "Analyze Today's Trades"
              )}
            </Button>
          </div>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <Card className="p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Today's Win Rate</p>
                <p className="text-2xl font-bold">{stats.winRate}</p>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Avg Trade Profit</p>
                <p className="text-2xl font-bold">{stats.avgProfit}</p>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Avg Trade Loss</p>
                <p className="text-2xl font-bold">{stats.avgLoss}</p>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Risk/Reward</p>
                <p className="text-2xl font-bold">{stats.riskReward}</p>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Max Trade Loss</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.maxDrawdown}
                </p>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Consistency Score</p>
                <p className="text-2xl font-bold">{stats.consistencyScore}</p>
              </Card>
            </div>

            <TradeFlowChart trades={trades} />
            <TimePerformanceHeatmap trades={trades} />
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <TradingCalendar />
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <IntradayRiskMetrics trades={trades} />
            <TimePerformanceHeatmap trades={trades} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <FOTradeTable 
              trades={trades} 
              onReplayTrade={(trade) => {
                // Implement trade replay functionality
                console.log("Replaying trade:", trade);
              }} 
            />
          </TabsContent>
        </Tabs>
      </div>

      <AIAnalysisPanel
        isOpen={isAnalysisPanelOpen}
        onClose={() => setIsAnalysisPanelOpen(false)}
        analysis={currentAnalysis}
      />
    </ErrorBoundary>
  );
}
