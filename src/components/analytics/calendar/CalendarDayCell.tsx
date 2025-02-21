
import { format, isSameMonth, isToday } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DayStats } from "./calendarUtils";
import { cn } from "@/lib/utils";
import { getPnLColor, formatPnL } from "./calendarUtils";

interface CalendarDayCellProps {
  day: Date;
  currentDate: Date;
  dayStats?: DayStats;
  view: 'pnl' | 'options' | 'psychology';
  isSelected: boolean;
  onSelect: (date: Date) => void;
}

export function CalendarDayCell({ 
  day, 
  currentDate, 
  dayStats, 
  view, 
  isSelected,
  onSelect 
}: CalendarDayCellProps) {
  const dayKey = format(day, "yyyy-MM-dd");

  const renderContent = () => {
    switch (view) {
      case 'options':
        return dayStats && (
          <>
            <div className="font-medium mb-1">{format(day, "d")}</div>
            <div className="text-[10px] space-y-1">
              {dayStats.vwapPosition && (
                <div className="capitalize">{dayStats.vwapPosition.replace('_', ' ')}</div>
              )}
              {dayStats.emaPosition && (
                <div className="capitalize">{dayStats.emaPosition.replace('_', ' ')}</div>
              )}
              {dayStats.vix && <div>VIX: {dayStats.vix.toFixed(1)}</div>}
              {(dayStats.callIv || dayStats.putIv) && (
                <div>IV: {dayStats.callIv?.toFixed(1)}/{dayStats.putIv?.toFixed(1)}</div>
              )}
            </div>
          </>
        );
      case 'psychology':
        return dayStats && (
          <>
            <div className="font-medium mb-1">{format(day, "d")}</div>
            <div className="text-[10px] space-y-1">
              {dayStats.marketCondition && (
                <div className="capitalize">{dayStats.marketCondition.replace('_', ' ')}</div>
              )}
              {dayStats.riskReward && (
                <div>R/R: {dayStats.riskReward.toFixed(1)}</div>
              )}
              {dayStats.emotionalState && (
                <div className="capitalize">{dayStats.emotionalState}</div>
              )}
              {dayStats.confidenceLevel && (
                <div>Conf: {dayStats.confidenceLevel}/5</div>
              )}
              {dayStats.disciplineScore !== undefined && (
                <div>Disc: {dayStats.disciplineScore}%</div>
              )}
            </div>
          </>
        );
      default:
        return dayStats && (
          <>
            <div className="font-medium mb-1">{format(day, "d")}</div>
            <div className="text-[10px] font-medium">
              {formatPnL(dayStats.totalPnL)}
            </div>
          </>
        );
    }
  };

  const renderTooltipContent = () => {
    if (!dayStats) return null;

    switch (view) {
      case 'options':
        return (
          <>
            <div>VWAP: {dayStats.vwapPosition?.replace('_', ' ') || 'N/A'}</div>
            <div>EMA: {dayStats.emaPosition?.replace('_', ' ') || 'N/A'}</div>
            <div>VIX: {dayStats.vix?.toFixed(1) || 'N/A'}</div>
            <div>Call IV: {dayStats.callIv?.toFixed(1) || 'N/A'}</div>
            <div>Put IV: {dayStats.putIv?.toFixed(1) || 'N/A'}</div>
          </>
        );
      case 'psychology':
        return (
          <>
            <div>Market: {dayStats.marketCondition?.replace('_', ' ') || 'N/A'}</div>
            <div>R/R: {dayStats.riskReward?.toFixed(1) || 'N/A'}</div>
            <div>Emotion: {dayStats.emotionalState || 'N/A'}</div>
            <div>Confidence: {dayStats.confidenceLevel ? `${dayStats.confidenceLevel}/5` : 'N/A'}</div>
            <div>Discipline: {dayStats.disciplineScore || 'N/A'}%</div>
          </>
        );
      default:
        return (
          <>
            <div>P&L: {formatPnL(dayStats.totalPnL)}</div>
            <div>Trades: {dayStats.tradeCount}</div>
          </>
        );
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onSelect(day)}
            className={cn(
              "py-2 px-1 rounded-md text-xs transition-colors min-h-[60px] w-full",
              !isSameMonth(day, currentDate) && "opacity-50",
              isToday(day) && "ring-1 ring-primary",
              isSelected && "ring-1 ring-primary ring-offset-2",
              dayStats
                ? getPnLColor(dayStats.totalPnL)
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            )}
          >
            {renderContent() || <div className="font-medium">{format(day, "d")}</div>}
          </button>
        </TooltipTrigger>
        {dayStats && (
          <TooltipContent>
            <div className="text-sm">{renderTooltipContent()}</div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
