import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Star, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Header Component
 * Renders the main navigation bar with a retro/pixel-art aesthetic.
 * Handles authentication states and conditional navigation links.
 */
export function Header() {
  // Destructure user state and logout method from the Auth Context
  const { user, logout } = useAuth();
  
  // Hook to programmatically redirect users after actions (like logout)
  const navigate = useNavigate();

  /**
   * Clears user session and redirects to the home page.
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-primary bg-card pixel-border">
      <div className="container flex h-16 items-center justify-between">
        
        {/* --- LOGO SECTION --- */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Pulsing glow effect behind the logo circle */}
            <div className="w-10 h-10 rounded-full bg-primary animate-pulse-glow" />
            {/* Inner glass effect for the "Pokéball" style icon */}
            <div className="absolute inset-1 rounded-full bg-primary-foreground/20" />
          </div>
          <span className="font-pixel text-sm md:text-base text-primary">
            POKÉDEX
          </span>
        </Link>

        {/* --- NAVIGATION SECTION --- */}
        <nav className="flex items-center gap-2 md:gap-4">
          
          {/* FAVORITES LINK: Only visible if a user is logged in */}
          {user && (
            <Link to="/favorites">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-secondary hover:text-secondary/80"
              >
                <Star className="h-4 w-4 fill-current" />
                {/* Text hidden on mobile to save space, visible on Medium screens+ */}
                <span className="hidden md:inline font-pixel text-[10px]">
                  Favorites
                </span>
              </Button>
            </Link>
          )}

          {/* AUTHENTICATION UI: Switches between User Info/Logout and Login button */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* USER BADGE: Displays the current username */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-muted">
                <User className="h-4 w-4 text-secondary" />
                <span className="font-pixel text-[10px] text-foreground">
                  {user.username}
                </span>
              </div>

              {/* LOGOUT BUTTON */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground retro-button"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline font-pixel text-[10px]">
                  Logout
                </span>
              </Button>
            </div>
          ) : (
            /* LOGIN BUTTON: Visible only when no user is authenticated */
            <Link to="/auth">
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2 bg-primary hover:bg-primary/90 retro-button"
              >
                <LogIn className="h-4 w-4" />
                <span className="font-pixel text-[10px]">
                  Login
                </span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}