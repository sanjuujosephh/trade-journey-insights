
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Trash, X } from "lucide-react";
import { PromptVariableValues } from "./PromptVariableValues";
import { Trade } from "@/types/trade";
import { toast } from "sonner";

interface CustomPromptAccordionProps {
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
  isEditingPrompt?: boolean;
  setIsEditingPrompt?: (isEditing: boolean) => void;
  savedPrompts?: string[];
  onSavePrompt?: (prompt: string) => void;
  onRemovePrompt?: (index: number) => void;
  onUsePrompt?: (prompt: string) => void;
  trades?: Trade[];
}

export function CustomPromptAccordion({
  customPrompt,
  setCustomPrompt,
  onSubmit,
  isAnalyzing,
  isEditingPrompt = false,
  setIsEditingPrompt = () => {},
  savedPrompts = [],
  onSavePrompt = () => {},
  onRemovePrompt = () => {},
  onUsePrompt = () => {},
  trades = []
}: CustomPromptAccordionProps) {
  const [isEditing, setIsEditing] = useState(isEditingPrompt);

  const resetCustomPrompt = () => {
    setIsEditing(false);
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
    <div>
      <h3 className="font-medium mb-4">Customize AI Analysis</h3>
      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <PromptVariableValues trades={trades} />
            
            <Textarea 
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[200px] text-sm"
              placeholder="Enter your custom analysis prompt here..."
            />
            
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={resetCustomPrompt}
              >
                Reset to Default
              </Button>
              
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setIsEditingPrompt(false);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    onSavePrompt(customPrompt);
                    setIsEditing(false);
                    setIsEditingPrompt(false);
                  }}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Prompt
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(true);
                setIsEditingPrompt(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Custom Prompt
            </Button>
            
            {savedPrompts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Saved Prompts</h4>
                
                <div className="grid gap-2">
                  {savedPrompts.map((prompt, index) => (
                    <div key={index} className="p-3 text-sm border rounded-md bg-background">
                      <div className="mb-2 truncate">{prompt.substring(0, 100)}...</div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemovePrompt(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onUsePrompt(prompt);
                            toast.success("Custom prompt applied!");
                          }}
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
