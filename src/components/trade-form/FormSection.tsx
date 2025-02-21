
import { ReactNode } from "react";

interface FormSectionProps {
  children: ReactNode;
}

export function FormSection({ children }: FormSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  );
}
