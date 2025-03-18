
import { useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";

interface CustomPromptAccordionProps {
  onPromptSubmit: (prompt: string) => void;
}

export function CustomPromptAccordion({ onPromptSubmit }: CustomPromptAccordionProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  
  const promptExamples = [
    {
      title: "Best Performing Timeframes",
      prompt: "Analyze my best performing timeframes. Identify the most profitable trading time window (morning vs. afternoon session) and compare trade success rates at different times of the day."
    },
    {
      title: "Strategy Performance",
      prompt: "Compare profitability across my different trading strategies. Identify strategies with the highest win percentage and risk-reward efficiency."
    },
    {
      title: "Market Conditions Analysis",
      prompt: "Analyze how different market conditions (bullish, bearish, range-bound) impact my profitability and provide insights on when I should avoid trading."
    },
    {
      title: "Volatility Correlation",
      prompt: "Compare my winning vs. losing trades based on the VIX level, Call IV, Put IV, and PCR values at trade entry. Highlight the optimal volatility conditions for my profitability."
    },
    {
      title: "Emotional Impact",
      prompt: "Correlate my entry emotions with trade outcomes and highlight patterns where a particular emotional state leads to more profitable or loss-making trades."
    },
    {
      title: "Exit Decision Analysis",
      prompt: "Compare the relationship between my exit emotions and trade outcomes. Identify if I tend to exit too early or too late due to emotional biases."
    }
  ];
  
  const handleUseExample = (prompt: string) => {
    setCustomPrompt(prompt);
  };
  
  const handleSubmit = () => {
    if (customPrompt.trim()) {
      onPromptSubmit(customPrompt);
    }
  };

  return (
    <Accordion type="single" collapsible className="mb-4">
      <AccordionItem value="custom-prompt">
        <AccordionTrigger className="text-sm">
          Add Custom Analysis Request
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Add specific questions or analysis requests to get more targeted insights
            </div>
            
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="E.g., Analyze my entry and exit timing patterns and suggest improvements..."
              className="min-h-[100px]"
            />
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCustomPrompt("")}
                className="text-xs"
              >
                Clear
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSubmit}
                className="text-xs"
                disabled={!customPrompt.trim()}
              >
                Apply Custom Prompt
              </Button>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Example Prompts</h4>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {promptExamples.map((example, index) => (
                    <div 
                      key={index}
                      className="p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleUseExample(example.prompt)}
                    >
                      <div className="flex justify-between items-start">
                        <h5 className="text-xs font-medium">{example.title}</h5>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 w-5 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseExample(example.prompt);
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {example.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
