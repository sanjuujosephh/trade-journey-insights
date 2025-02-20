
interface TradeChartProps {
  chartLink: string | null | undefined;
}

export function TradeChart({ chartLink }: TradeChartProps) {
  if (!chartLink) return null;

  return (
    <div className="w-full bg-card p-4 rounded-lg border">
      <h4 className="text-sm font-medium mb-2">Chart</h4>
      <a
        href={chartLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline text-sm inline-flex items-center gap-2"
      >
        View TradingView Chart
      </a>
    </div>
  );
}
