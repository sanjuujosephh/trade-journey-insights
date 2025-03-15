
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateFilterControlsProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  clearDateFilter: () => void;
  navigateToHistoryTab: () => void;
}

export function DateFilterControls({
  selectedDate,
  setSelectedDate,
  clearDateFilter,
  navigateToHistoryTab
}: DateFilterControlsProps) {
  return (
    <div className="flex items-center justify-between gap-2 px-[30px]">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "w-[240px] justify-start text-left font-normal", 
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "dd-MM-yyyy") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar 
              mode="single" 
              selected={selectedDate} 
              onSelect={setSelectedDate} 
              initialFocus 
            />
          </PopoverContent>
        </Popover>

        {selectedDate && (
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={clearDateFilter}
          >
            Clear
          </Button>
        )}
      </div>
      
      <h2 className="text-xl font-semibold">Recent Trades</h2>
      
      <Button 
        variant="ghost" 
        onClick={navigateToHistoryTab} 
        className="flex items-center gap-1 text-primary"
      >
        View All Entries
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
