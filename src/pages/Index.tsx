
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LandingPage } from "@/components/landing/LandingPage";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { AIAnalysisPanel } from "@/components/AIAnalysisPanel";

export default function Index() {
  const [activeTab, setActiveTab] = useState("trade-entry");
  const { user } = useAuth();
  const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('entry_time', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const analyzeTradesWithAI = async (options: { days?: number }) => {
    setIsAnalyzing(true);
    try {
      const response = await supabase.functions.invoke('analyze-trades', {
        body: { trades, days: options.days || 1 }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to analyze trades');
      }

      setCurrentAnalysis(response.data.analysis);
      setIsAnalysisPanelOpen(true);
    } catch (error) {
      console.error('AI Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-background overflow-auto">
      <div className="container h-full py-4">
        <DashboardHeader profile={profile} user={user} />
        <DashboardTabs
          trades={trades}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAnalyzing={isAnalyzing}
          currentAnalysis={currentAnalysis}
          analyzeTradesWithAI={analyzeTradesWithAI}
        />
      </div>

      <AIAnalysisPanel
        isOpen={isAnalysisPanelOpen}
        onClose={() => setIsAnalysisPanelOpen(false)}
        analysis={currentAnalysis}
      />
    </div>
  );
}
