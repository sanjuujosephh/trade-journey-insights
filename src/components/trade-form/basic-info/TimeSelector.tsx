
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  timeOptions: { value: string; label: string; }[];
}

export function TimeSelector({ value, onValueChange, timeOptions }: TimeSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[100px]">
        <Clock className="h-[1.2rem] w-[1.2rem] mr-2" />
        <SelectValue placeholder="Time">{value || "Time"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="cursor-pointer hover:bg-accent"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
