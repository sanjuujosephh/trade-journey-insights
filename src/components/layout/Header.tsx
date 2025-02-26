
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { Link } from "react-router-dom";
import { TraderInfo } from "@/components/TraderInfo";

export function Header() {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] || 'Guest';

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center mb-4">
          <TraderInfo />
          <Link to="/" className="text-xl font-bold">
            Onetradejournal
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium">P&L</div>
              <div className="text-success text-lg font-bold">₹18,900</div>
            </div>
            <ThemeToggle />
            {user ? (
              <UserMenu />
            ) : (
              <Button asChild>
                <Link to="/">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {user && (
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold">Hey {firstName},</h1>
              <p className="text-muted-foreground">
                Track, analyze, and improve your trading performance
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">
                Watch Journal Overview
              </Button>
              <Button>
                Subscribe To Daily Shorts
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
