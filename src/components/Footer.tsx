
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-8">
          <nav className="flex justify-center gap-6">
            <Link to="/privacy-policy" className="text-sm hover:underline">
              Privacy Policy
            </Link>
            <Link to="/no-refund-policy" className="text-sm hover:underline">
              No Refund Policy
            </Link>
            <Link to="/terms" className="text-sm hover:underline">
              Terms and Conditions
            </Link>
          </nav>

          <div className="text-sm text-muted-foreground space-y-4">
            <p className="text-center">
              © 2025 Onetradejournal by Softscotch Solution Private Limited. All Rights Reserved.
            </p>
            <div className="prose prose-sm max-w-4xl mx-auto text-muted-foreground text-left space-y-4">
              <h3 className="text-base font-medium text-foreground text-center">Disclaimer: No Investment Advice</h3>
              <p>
                Investment is subject to market risks. Uncertainty is always a factor, and various risks can overlap and amplify each other, potentially leading to unforeseen impacts on the value of investments. The value of assets and any associated income may rise or fall, and there is a possibility of losing the full amount of your initial investment. Market fluctuations and related changes are just some of the factors that can influence these variations. Historical performance does not guarantee or predict future results.
              </p>
              <p>
                The information on this Website, including opinions, analysis, suggestions, news, prices, AI suggestions, and other content, is provided for general informational and educational purposes only. It should not be interpreted as investment advice or relied upon in place of thorough independent research before making trading decisions. Market conditions, opinions, and recommendations are subject to change without prior notice. Onetradejournal by Softscotch Solution Private Limited is not responsible for any loss or damage, including but not limited to financial losses, resulting from reliance on the information provided.
              </p>
              <p>
                We strongly advise against using technical analysis as the sole basis for trading decisions or making impulsive trading moves. Always remember that past performance does not guarantee future results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
