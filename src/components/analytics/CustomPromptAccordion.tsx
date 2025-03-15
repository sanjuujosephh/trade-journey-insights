
import { useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CustomPromptAccordionProps {
  onCustomAnalysis: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

export function CustomPromptAccordion({ 
  onCustomAnalysis,
  isLoading 
}: CustomPromptAccordionProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    
    await onCustomAnalysis(customPrompt);
  };
  
  return (
    <Accordion type="single" collapsible className="border rounded-md">
      <AccordionItem value="custom-prompt">
        <AccordionTrigger className="px-4">Custom Analysis Prompt</AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Enter your custom AI analysis prompt..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={isLoading || !customPrompt.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Run Analysis"
              )}
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
