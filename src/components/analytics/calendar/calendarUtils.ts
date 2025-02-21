
import { format } from "date-fns";

export interface DayStats {
  totalPnL: number;
  tradeCount: number;
  vix?: number;
  callIv?: number;
  putIv?: number;
  marketCondition?: string;
  riskReward?: number;
  emotionalState?: string;
  emotionalScore?: number;
  confidenceScore?: number;
  vwapPosition?: string;
  emaPosition?: string;
  option_type?: string;
  trade_direction?: string;
  disciplineScore?: number;
}

export interface TradeDay {
  [key: string]: DayStats;
}

export const getPnLColor = (pnl: number) => {
  if (pnl > 0) return "bg-green-100 hover:bg-green-200 text-green-800";
  if (pnl < 0) return "bg-red-100 hover:bg-red-200 text-red-800";
  return "bg-gray-100 hover:bg-gray-200 text-gray-600";
};

export const formatPnL = (pnl: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pnl);
};
