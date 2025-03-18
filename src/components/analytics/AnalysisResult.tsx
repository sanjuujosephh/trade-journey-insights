
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisResultProps {
  currentAnalysis: string;
  isAnalyzing?: boolean;
}

export function AnalysisResult({ currentAnalysis, isAnalyzing = false }: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState("all");
  
  // Split analysis into sections based on common patterns in GPT output
  const sections = currentAnalysis?.split(/\n(?=[A-Z][^a-z]*:)/) || [];
  
  // Group sections by category
  const performanceSections = sections.filter(s => 
    s.includes("Timeframe") || 
    s.includes("Profitab") || 
    s.includes("Perform") || 
    s.includes("Strateg")
  );
  
  const behavioralSections = sections.filter(s => 
    s.includes("Behavior") || 
    s.includes("Emotion") || 
    s.includes("Psycholog") || 
    s.includes("Decision") ||
    s.includes("Consistency")
  );
  
  const recommendationSections = sections.filter(s => 
    s.includes("Recommend") || 
    s.includes("Suggestion") || 
    s.includes("Improve") || 
    s.includes("Action")
  );
  
  const otherSections = sections.filter(s => 
    !performanceSections.includes(s) && 
    !behavioralSections.includes(s) && 
    !recommendationSections.includes(s) &&
    s.trim().length > 0
  );

  if (isAnalyzing) {
    return (
      <div className="bg-card border rounded-lg p-6 min-h-[400px] flex flex-col">
        <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis</CardTitle>
          <CardDescription>Run an analysis to see AI-generated insights</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p>No analysis available yet.</p>
          <p className="text-sm mt-2">
            Run an analysis to see AI-generated insights about your trading.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Analysis</CardTitle>
        <CardDescription>
          Insights and recommendations based on your trading data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[400px] pr-4">
            <TabsContent value="all" className="space-y-6 mt-0">
              {renderSections([...otherSections, ...performanceSections, ...behavioralSections, ...recommendationSections])}
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6 mt-0">
              {renderSections(performanceSections)}
            </TabsContent>
            
            <TabsContent value="behavioral" className="space-y-6 mt-0">
              {renderSections(behavioralSections)}
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-6 mt-0">
              {renderSections(recommendationSections)}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper function to render sections
function renderSections(sections: string[]) {
  if (sections.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>No relevant information available in this category.</p>
      </div>
    );
  }
  
  return sections.map((section, index) => {
    if (!section || section.trim().length === 0) return null;
    
    const [title, ...content] = section.split('\n');
    return (
      <div key={index} className="space-y-2">
        <h3 className="text-base font-semibold text-primary">
          {title.trim()}
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {content.map((paragraph, pIndex) => {
            if (!paragraph || paragraph.trim().length === 0) return null;
            
            // Check if it's a list item
            if (paragraph.trim().startsWith("- ")) {
              return (
                <div key={pIndex} className="ml-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                  <span className="leading-relaxed">{paragraph.trim().substring(2)}</span>
                </div>
              );
            }
            
            return (
              <p key={pIndex} className="leading-relaxed">
                {paragraph.trim()}
              </p>
            );
          })}
        </div>
      </div>
    );
  });
}
