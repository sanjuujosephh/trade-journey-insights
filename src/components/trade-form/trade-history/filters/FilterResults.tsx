
interface FilterResultsProps {
  tradesCount: {
    filtered: number;
    total: number;
  };
}

export function FilterResults({ tradesCount }: FilterResultsProps) {
  return (
    <div className="text-sm text-muted-foreground py-1">
      Showing {tradesCount.filtered} of {tradesCount.total} trades
    </div>
  );
}
