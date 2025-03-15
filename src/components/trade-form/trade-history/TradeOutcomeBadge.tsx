
interface TradeOutcomeBadgeProps {
  pnl: number | null;
}

export function TradeOutcomeBadge({ pnl }: TradeOutcomeBadgeProps) {
  const getOutcomeStyle = (pnl: number | null) => {
    if (pnl === null) return 'bg-gray-100 text-gray-800';
    if (pnl > 0) return 'bg-green-100 text-green-800';
    if (pnl < 0) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getOutcomeText = (pnl: number | null) => {
    if (pnl === null) return 'Pending';
    if (pnl > 0) return 'Profit';
    if (pnl < 0) return 'Loss';
    return 'Breakeven';
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded-[3px] text-xs ${getOutcomeStyle(pnl)}`}
      data-outcome={getOutcomeText(pnl).toLowerCase()}
    >
      {getOutcomeText(pnl)}
    </span>
  );
}
