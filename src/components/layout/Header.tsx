
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { Link } from "react-router-dom";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          OneTradeJournal
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button asChild>
              <Link to="/">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

