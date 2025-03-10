
import { MessageCircleQuestion } from "lucide-react";

interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({
  question,
  answer
}: FaqItemProps) {
  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm hover:border-primary transition-colors">
      <div className="flex gap-3 items-start">
        <MessageCircleQuestion className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-lg mb-2">{question}</h3>
          <p className="text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}
