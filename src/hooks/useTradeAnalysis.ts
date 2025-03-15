
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTradeQueries } from "./useTradeQueries";
import { useTradeAuth } from "./useTradeAuth";

export function useTradeAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useTradeAuth();
  const { trades } = useTradeQueries(userId);

  const callAnalysisFunction = async (
    endpoint: string,
    payload: any
  ): Promise<string> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke(
        `analyze-trades/${endpoint}`,
        {
          body: {
            ...payload,
            userId
          }
        }
      );

      if (error) {
        console.error(`Error in ${endpoint} analysis:`, error);
        throw new Error(`Analysis failed: ${error.message}`);
      }

      if (!data || !data.analysis) {
        console.error(`No analysis returned from ${endpoint}`);
        throw new Error("No analysis was generated");
      }

      return data.analysis;
    } catch (error) {
      console.error("Analysis error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzePerformance = async (): Promise<string> => {
    return callAnalysisFunction("performance", { trades });
  };

  const analyzeRiskProfile = async (): Promise<string> => {
    return callAnalysisFunction("risk-profile", { trades });
  };

  const analyzeImprovements = async (): Promise<string> => {
    return callAnalysisFunction("improvements", { trades });
  };

  const analyzePsychology = async (): Promise<string> => {
    return callAnalysisFunction("psychology", { trades });
  };

  const createCustomAnalysis = async (prompt: string): Promise<string> => {
    return callAnalysisFunction("custom", { trades, prompt });
  };

  return {
    analyzePerformance,
    analyzeRiskProfile,
    analyzeImprovements,
    analyzePsychology,
    createCustomAnalysis,
    isLoading
  };
}
