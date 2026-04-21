import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { clearAuthSession, getAuthUser, isAuthenticated } from "@/lib/auth";
import { useMemo, useState } from "react";

export function Navbar() {
  const [authVersion, setAuthVersion] = useState(0);
  const authenticated = useMemo(() => isAuthenticated(), [authVersion]);
  const user = useMemo(() => getAuthUser(), [authVersion]);

  const handleSignOut = () => {
    clearAuthSession();
    setAuthVersion((v) => v + 1);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>StrideSync</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          <Link to="/analytics" className="text-muted-foreground hover:text-foreground transition-colors">Analytics</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {authenticated ? (
            <>
              <span className="hidden md:inline text-xs text-muted-foreground max-w-[140px] truncate">
                {user?.email}
              </span>
              <Button asChild size="sm" variant="outline">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="outline">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
