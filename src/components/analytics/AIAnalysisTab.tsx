
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CreditsDisplay } from "./CreditsDisplay";
import { CreditTransactionsPanel } from "./CreditTransactionsPanel";
import { PurchaseCreditsDialog } from "./PurchaseCreditsDialog";
import { useUserCredits } from "@/hooks/useUserCredits";
import { Loader2, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Trade } from "@/types/trade";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AIAnalysisTabProps {
  trades: Trade[];
  isAnalyzing: boolean;
  currentAnalysis: string;
  analyzeTradesWithAI: (options: { days?: number, customPrompt?: string }) => void;
}

export function AIAnalysisTab({ 
  trades, 
  isAnalyzing, 
  currentAnalysis, 
  analyzeTradesWithAI 
}: AIAnalysisTabProps) {
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string>(`As a trading analyst, analyze these trading patterns:

Trading Summary:
- Total Trades: {{totalTrades}}
- Win Rate: {{winRate}}%

Strategy Performance:
{{strategyPerformance}}

Provide specific insights on:
1. Pattern analysis of winning vs losing trades
2. Strategy effectiveness
3. Risk management suggestions
4. Concrete recommendations for improvement

Trades data: {{tradesData}}`);

  const { 
    credits, 
    transactions, 
    totalCredits,
    isLoading,
    useCredits
  } = useUserCredits();

  const handleAnalyze = async (days: number) => {
    let creditCost = 1; // Default cost
    
    // Adjust cost based on analysis scope
    if (days > 1 && days <= 7) {
      creditCost = 3;
    } else if (days > 7) {
      creditCost = 5;
    }
    
    try {
      // Check if user has enough credits
      if (totalCredits < creditCost) {
        toast.error(`You need ${creditCost} credits for this analysis. Please purchase more credits.`);
        setIsPurchaseDialogOpen(true);
        return;
      }
      
      // Use credits and then perform analysis
      await useCredits.mutateAsync({ 
        amount: creditCost, 
        description: `Trade analysis (${days > 1 ? `${days} days` : 'Today'})`
      });
      
      // Once credits are deducted, run the analysis with custom prompt if editing
      analyzeTradesWithAI({ 
        days,
        customPrompt: isEditingPrompt ? customPrompt : undefined
      });
      
      // Show success message
      toast.success(`Used ${creditCost} ${creditCost === 1 ? 'credit' : 'credits'} for analysis`);
    } catch (error) {
      console.error('Failed to use credits for analysis:', error);
    }
  };

  return (
    <div className="p-1 sm:p-2 md:p-6">
      <CreditsDisplay 
        credits={credits} 
        isLoading={isLoading}
        onPurchaseClick={() => setIsPurchaseDialogOpen(true)}
      />
      
      <Accordion type="single" collapsible className="my-4">
        <AccordionItem value="custom-prompt">
          <AccordionTrigger className="text-sm">
            Customize AI Analysis Prompt
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Use variables: &#123;&#123;totalTrades&#125;&#125;, &#123;&#123;winRate&#125;&#125;, &#123;&#123;strategyPerformance&#125;&#125;, &#123;&#123;tradesData&#125;&#125;
                </p>
                {isEditingPrompt ? (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsEditingPrompt(false)}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditingPrompt(false);
                        setCustomPrompt(`As a trading analyst, analyze these trading patterns:

Trading Summary:
- Total Trades: {{totalTrades}}
- Win Rate: {{winRate}}%

Strategy Performance:
{{strategyPerformance}}

Provide specific insights on:
1. Pattern analysis of winning vs losing trades
2. Strategy effectiveness
3. Risk management suggestions
4. Concrete recommendations for improvement

Trades data: {{tradesData}}`);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsEditingPrompt(true)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              
              {isEditingPrompt ? (
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[150px] font-mono text-xs"
                  placeholder="Enter your custom prompt here..."
                />
              ) : (
                <Card className="p-2 bg-muted/50">
                  <pre className="text-xs overflow-auto whitespace-pre-wrap">
                    {customPrompt}
                  </pre>
                </Card>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex flex-col md:flex-row md:justify-end gap-4 my-6">
        <Button
          onClick={() => handleAnalyze(1)}
          disabled={isAnalyzing || trades.length === 0}
          className="w-full md:w-auto"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Today's Trades...
            </>
          ) : (
            <>Analyze Today's Trades (1 Credit)</>
          )}
        </Button>
        <Button
          onClick={() => handleAnalyze(7)}
          disabled={isAnalyzing || trades.length === 0}
          className="w-full md:w-auto"
        >
          Analyze Last 7 Days' Trades (3 Credits)
        </Button>
        <Button
          onClick={() => handleAnalyze(30)}
          disabled={isAnalyzing || trades.length === 0}
          className="w-full md:w-auto"
        >
          Analyze This Month's Trades (5 Credits)
        </Button>
      </div>
      
      <Card className="p-2 sm:p-4 md:p-6 mb-6">
        {currentAnalysis ? (
          <p className="whitespace-pre-wrap text-sm md:text-base">{currentAnalysis}</p>
        ) : (
          <p className="text-muted-foreground text-sm md:text-base">
            Select an analysis option above to get AI insights about your trades.
          </p>
        )}
      </Card>
      
      <CreditTransactionsPanel transactions={transactions} />
      
      <PurchaseCreditsDialog 
        open={isPurchaseDialogOpen} 
        onOpenChange={setIsPurchaseDialogOpen} 
      />
    </div>
  );
}
