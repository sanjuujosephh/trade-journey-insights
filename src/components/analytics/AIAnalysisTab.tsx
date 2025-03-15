
import { useState, useEffect } from "react";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useTradeAnalysis } from "@/hooks/useTradeAnalysis";
import { useTradeAuth } from "@/hooks/useTradeAuth";
import { AnalysisButtons } from "./AnalysisButtons";
import { AnalysisResult } from "./AnalysisResult";
import { CreditsDisplay } from "./CreditsDisplay";
import { PurchaseCreditsDialog } from "./PurchaseCreditsDialog";
import { toast } from "@/hooks/use-toast";
import { CustomPromptAccordion } from "./CustomPromptAccordion";

export function AIAnalysisTab() {
  const [currentAnalysis, setCurrentAnalysis] = useState("");
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [isRefreshingCredits, setIsRefreshingCredits] = useState(false);
  
  const { userId } = useTradeAuth();
  const { 
    credits, 
    availableCredits,
    useCredits, 
    refetch: refetchCredits 
  } = useUserCredits();
  
  const { 
    analyzePerformance,
    analyzeRiskProfile,
    analyzeImprovements,
    analyzePsychology,
    createCustomAnalysis,
    isLoading: isAnalysisLoading
  } = useTradeAnalysis();
  
  // Make sure to immediately fetch credits when the component mounts
  // or when the user ID changes
  useEffect(() => {
    console.log('AIAnalysisTab mounted or userId changed, fetching credits');
    if (userId) {
      refetchCredits();
    }
    console.log('Current credits in AIAnalysisTab:', credits);
  }, [userId, refetchCredits]);
  
  // Refresh credits every 10 seconds
  useEffect(() => {
    if (!userId) return;
    
    const interval = setInterval(() => {
      refetchCredits();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [userId, refetchCredits]);
  
  const handleRefreshCredits = async () => {
    setIsRefreshingCredits(true);
    await refetchCredits();
    setTimeout(() => {
      setIsRefreshingCredits(false);
    }, 1000);
  };
  
  const handleAnalysisRequest = async (
    analysisFunction: () => Promise<string>, 
    description: string
  ) => {
    try {
      // First, check if there are enough credits
      if (availableCredits < 1) {
        toast({
          title: "Insufficient credits",
          description: "You don't have enough credits for this analysis. Please purchase more.",
          variant: "destructive"
        });
        setShowPurchaseDialog(true);
        return;
      }
      
      // Deduct credits before analysis
      console.log(`Deducting 1 credit for ${description}`);
      const creditResult = await useCredits(1, `Used for ${description} analysis`);
      
      if (!creditResult.success) {
        throw new Error('Failed to deduct credits');
      }
      
      // Refresh credits immediately after deduction
      await refetchCredits();
      
      // Clear previous analysis
      setCurrentAnalysis("");
      
      // Run the analysis
      console.log(`Running ${description} analysis`);
      const result = await analysisFunction();
      
      // Set the analysis result
      setCurrentAnalysis(result);
      
      // If analysis is empty or failed, refund the credit
      if (!result || result.trim() === '') {
        console.log('Analysis failed or returned empty result, refunding credit');
        await useCredits(-1, `Refund for failed ${description} analysis`, 'refund');
        
        toast({
          title: "Analysis failed",
          description: "The analysis failed to generate results. Your credit has been refunded.",
          variant: "destructive"
        });
      }
      
      // Refresh credits after analysis
      await refetchCredits();
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Attempt to refund the credit
      try {
        await useCredits(-1, `Refund for failed ${description} analysis`, 'refund');
        console.log('Credit refunded due to error');
      } catch (refundError) {
        console.error('Failed to refund credit:', refundError);
      }
      
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to generate analysis",
        variant: "destructive"
      });
      
      // Refresh credits after error
      await refetchCredits();
    }
  };
  
  return (
    <div className="space-y-4">
      <CreditsDisplay 
        credits={credits} 
        onBuyCredits={() => setShowPurchaseDialog(true)}
        onRefresh={handleRefreshCredits}
        isRefreshing={isRefreshingCredits}
      />
      
      <AnalysisButtons
        onAnalyzePerformance={() => 
          handleAnalysisRequest(analyzePerformance, "performance")
        }
        onAnalyzeRiskProfile={() => 
          handleAnalysisRequest(analyzeRiskProfile, "risk profile")
        }
        onAnalyzeImprovements={() => 
          handleAnalysisRequest(analyzeImprovements, "improvements")
        }
        onAnalyzePsychology={() => 
          handleAnalysisRequest(analyzePsychology, "trading psychology")
        }
        isLoading={isAnalysisLoading}
      />
      
      <AnalysisResult currentAnalysis={currentAnalysis} />
      
      <CustomPromptAccordion
        onCustomAnalysis={(prompt) => 
          handleAnalysisRequest(() => createCustomAnalysis(prompt), "custom analysis")
        }
        isLoading={isAnalysisLoading}
      />
      
      <PurchaseCreditsDialog 
        open={showPurchaseDialog} 
        onOpenChange={setShowPurchaseDialog}
      />
    </div>
  );
}
