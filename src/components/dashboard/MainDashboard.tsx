
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardTabs } from "./DashboardTabs";
import { AIAnalysisPanel } from "@/components/AIAnalysisPanel";
import { RequireSubscription } from "@/components/subscription/RequireSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function MainDashboard() {
  const [activeTab, setActiveTab] = useState("trade-entry");
  const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile');
          return null;
        }
        return data;
      } catch (error) {
        console.error('Error in profile query:', error);
        toast.error('Failed to load profile');
        return null;
      }
    },
    enabled: !!user
  });

  const { data: trades = [], isLoading: isTradesLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .order('entry_time', { ascending: false });
        
        if (error) {
          console.error('Error fetching trades:', error);
          toast.error('Failed to load trades');
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Error in trades query:', error);
        toast.error('Failed to load trades');
        return [];
      }
    },
    enabled: !!user
  });

  const analyzeTradesWithAI = async (options: { days?: number }) => {
    setIsAnalyzing(true);
    try {
      const response = await supabase.functions.invoke('analyze-trades', {
        body: { trades, days: options.days || 1 }
      });

      if (response.error) {
        console.error('AI Analysis error:', response.error);
        toast.error('Failed to analyze trades');
        throw new Error(response.error.message || 'Failed to analyze trades');
      }

      setCurrentAnalysis(response.data.analysis);
      setIsAnalysisPanelOpen(true);
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast.error('Failed to analyze trades');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <RequireSubscription>
      <div className="bg-background min-h-screen">
        <div className="container py-4">
          <DashboardHeader profile={profile} user={user} />
          <div className="mt-8">
            <DashboardTabs
              trades={trades}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isAnalyzing={isAnalyzing}
              currentAnalysis={currentAnalysis}
              analyzeTradesWithAI={analyzeTradesWithAI}
            />
          </div>
        </div>

        <AIAnalysisPanel 
          isOpen={isAnalysisPanelOpen}
          onClose={() => setIsAnalysisPanelOpen(false)}
          analysis={currentAnalysis}
        />
      </div>
    </RequireSubscription>
  );
}
