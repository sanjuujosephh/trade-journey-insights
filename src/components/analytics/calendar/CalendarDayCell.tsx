
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
  const renderContent = () => {
    switch (view) {
      case 'options':
        return dayStats && (
          <>
            <div className="font-medium mb-1">{format(day, "d")}</div>
            <div className="text-[10px] space-y-1">
              {dayStats.trade_direction && (
                <div className="text-xs capitalize">
                  {dayStats.option_type} {dayStats.trade_direction}
                </div>
              )}
              {(dayStats.vwapPosition || dayStats.emaPosition) && (
                <div className="text-xs">
                  Price was: {dayStats.vwapPosition?.replace('_', ' ')}
                  {dayStats.emaPosition && `, ${dayStats.emaPosition.replace('_', ' ')}`}
                </div>
              )}
              {dayStats.vix && (
                <div className="text-xs">VIX: {dayStats.vix.toFixed(1)}</div>
              )}
              {(dayStats.callIv || dayStats.putIv) && (
                <div className="text-xs">
                  IV: {dayStats.callIv?.toFixed(1)}/{dayStats.putIv?.toFixed(1)}
                </div>
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
                <div className="text-xs capitalize">{dayStats.marketCondition.replace('_', ' ')}</div>
              )}
              {dayStats.riskReward && (
                <div className="text-xs">R/R: {dayStats.riskReward.toFixed(1)}</div>
              )}
              {dayStats.emotionalState && (
                <div className={cn(
                  "text-xs capitalize",
                  dayStats.emotionalState === 'positive' && "text-green-600",
                  dayStats.emotionalState === 'negative' && "text-red-600"
                )}>
                  {dayStats.emotionalState}
                </div>
              )}
              {dayStats.confidenceScore !== undefined && (
                <div className="text-xs">Conf: {Math.round(dayStats.confidenceScore)}%</div>
              )}
            </div>
          </>
        );
      default:
        return dayStats && (
          <>
            <div className="font-medium mb-1">{format(day, "d")}</div>
            <div className="text-xs font-medium">
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
            <div>Direction: {dayStats.option_type} {dayStats.trade_direction}</div>
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
            <div>Emotional State: {dayStats.emotionalState || 'N/A'}</div>
            <div>Emotional Score: {dayStats.emotionalScore?.toFixed(1) || 'N/A'}</div>
            <div>Confidence: {Math.round(dayStats.confidenceScore || 0)}%</div>
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
              "p-2 rounded-md transition-colors min-h-[75px] w-full",
              !isSameMonth(day, currentDate) && "opacity-50",
              isToday(day) && "ring-1 ring-primary",
              isSelected && "ring-1 ring-primary ring-offset-2",
              dayStats
                ? getPnLColor(dayStats.totalPnL)
                : "bg-gray-50 hover:bg-gray-100"
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
