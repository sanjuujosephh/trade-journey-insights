
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LandingPage } from "@/components/landing/LandingPage";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { AIAnalysisPanel } from "@/components/AIAnalysisPanel";
import { toast } from "sonner";

export default function Index() {
  const [activeTab, setActiveTab] = useState("trade-entry");
  const { user } = useAuth();
  const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prevUserState, setPrevUserState] = useState<boolean>(!!user);

  // Scroll to top on component mount and tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);
  
  // Handle scroll position after login
  useEffect(() => {
    // If user exists (is logged in)
    if (user) {
      // Force an immediate scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'instant' // Use instant for immediate scrolling without animation
      });
      
      // Also use a timeout as a fallback to ensure it happens after render
      const scrollTimeout = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }, 100); // Using a slightly longer timeout for reliability
      
      return () => clearTimeout(scrollTimeout);
    }
  }, [user?.id]); // Use user.id to ensure this only runs when the actual user changes
  
  // Track user login state changes
  useEffect(() => {
    const currentUserState = !!user;
    
    // If user has just logged in (from logged out to logged in)
    if (currentUserState && !prevUserState) {
      console.log("User logged in - scrolling to top");
      
      // Force scroll to top immediately
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
      
      // Also use a timeout approach for reliability
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }, 100);
    }
    
    // Update the previous user state
    setPrevUserState(currentUserState);
  }, [user, prevUserState]);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return null;
        }
        return data;
      } catch (error) {
        console.error('Error in profile query:', error);
        return null;
      }
    },
    enabled: !!user?.id
  });

  const { data: trades = [], isLoading: isTradesLoading } = useQuery({
    queryKey: ['trades', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .order('entry_time', { ascending: false });
        
        if (error) {
          console.error('Error fetching trades:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Error in trades query:', error);
        return [];
      }
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
        console.error('AI Analysis error:', response.error);
        toast.error('Failed to analyze trades');
        throw new Error(response.error.message || 'Failed to analyze trades');
      }

      setCurrentAnalysis(response.data.analysis);
      setIsAnalysisPanelOpen(true);
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast.error('An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="bg-background min-h-screen w-full overflow-x-hidden">
      <div className="container py-4 w-full">
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
  );
}
