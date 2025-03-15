import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PromptVariableValues } from "./PromptVariableValues";
import { Trade } from "@/types/trade";
interface CustomPromptAccordionProps {
  customPrompt?: string;
  setCustomPrompt?: (prompt: string) => void;
  isEditingPrompt?: boolean;
  setIsEditingPrompt?: (isEditing: boolean) => void;
  savedPrompts?: string[];
  onSavePrompt?: (prompt: string) => void;
  onRemovePrompt?: (index: number) => void;
  onUsePrompt?: (prompt: string) => void;
  trades?: Trade[];
}
export function CustomPromptAccordion({
  customPrompt = "",
  setCustomPrompt = () => {},
  isEditingPrompt = false,
  setIsEditingPrompt = () => {},
  savedPrompts = [],
  onSavePrompt = () => {},
  onRemovePrompt = () => {},
  onUsePrompt = () => {},
  trades = []
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
  return <Accordion type="single" collapsible className="my-4">
      
    </Accordion>;
}