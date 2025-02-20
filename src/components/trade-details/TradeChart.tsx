
interface TradeChartProps {
  chartLink: string | null | undefined;
}

export function TradeChart({ chartLink }: TradeChartProps) {
  if (!chartLink) return null;

  // Convert base64 or URL to proper format
  const imageUrl = chartLink.startsWith('data:') ? chartLink : chartLink;

  return (
    <div className="w-full bg-card p-4 rounded-lg border">
      <h4 className="text-sm font-medium mb-2">Chart</h4>
      <div className="relative rounded-md overflow-hidden border border-border">
        <img 
          src={imageUrl} 
          alt="TradingView Chart"
          className="w-full h-auto object-contain bg-background"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = '/placeholder.svg'; // Fallback image
          }}
        />
        <a
          href={chartLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-primary hover:underline text-sm px-3 py-1.5 rounded-md inline-flex items-center gap-2"
        >
          Open in TradingView
        </a>
      </div>
    </div>
  );
}
