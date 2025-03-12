
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CustomPromptAccordionProps {
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  isEditingPrompt: boolean;
  setIsEditingPrompt: (isEditing: boolean) => void;
}

export function CustomPromptAccordion({
  customPrompt,
  setCustomPrompt,
  isEditingPrompt,
  setIsEditingPrompt
}: CustomPromptAccordionProps) {
  const resetCustomPrompt = () => {
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
  };

  return (
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
                    onClick={resetCustomPrompt}
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
  );
}
