import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Star, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-primary bg-card pixel-border">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary animate-pulse-glow" />
            <div className="absolute inset-1 rounded-full bg-primary-foreground/20" />
          </div>
          <span className="font-pixel text-sm md:text-base text-primary">
            POKÉDEX
          </span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-4">
          {user && (
            <Link to="/favorites">
              <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-secondary/80">
                <Star className="h-4 w-4 fill-current" />
                <span className="hidden md:inline font-pixel text-[10px]">Favorites</span>
              </Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-muted">
                <User className="h-4 w-4 text-secondary" />
                <span className="font-pixel text-[10px] text-foreground">{user.username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground retro-button"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline font-pixel text-[10px]">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2 bg-primary hover:bg-primary/90 retro-button"
              >
                <LogIn className="h-4 w-4" />
                <span className="font-pixel text-[10px]">Login</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
