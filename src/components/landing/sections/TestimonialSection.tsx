
export function TestimonialSection() {
  return (
    <div className="bg-card border rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">What traders are saying</h2>
      <div className="grid gap-6">
        <blockquote className="border-l-2 border-primary pl-4 italic">
          "This journal has completely transformed how I approach trading. The analytics helped me identify patterns I couldn't see before."
          <footer className="mt-2 text-sm font-medium">— Rajesh K, Options Trader</footer>
        </blockquote>
        <blockquote className="border-l-2 border-primary pl-4 italic">
          "Finally a trading journal that focuses on improvement, not just tracking. The AI analysis is like having a mentor review my trades."
          <footer className="mt-2 text-sm font-medium">— Priya S, Day Trader</footer>
        </blockquote>
      </div>
    </div>
  );
}
