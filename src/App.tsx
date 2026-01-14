import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";

/**
 * Initialize TanStack Query Client.
 * This manages caching, background updates, and stale data for your API requests.
 */
const queryClient = new QueryClient();

/**
 * Main App Component
 * * Hierarchy Logic:
 * 1. QueryClientProvider: The outermost layer for data fetching state.
 * 2. AuthProvider: Wraps everything to ensure user session is available to all logic.
 * 3. FavoritesProvider: Inside AuthProvider because it needs the 'user' object to function.
 * 4. TooltipProvider/Toasters: Global UI utilities for notifications and hints.
 * 5. BrowserRouter: Enables client-side routing.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FavoritesProvider>
        {/* TooltipProvider ensures accessible tooltips work throughout the app */}
        <TooltipProvider>
          
          {/* Global Notification Systems */}
          <Toaster /> {/* Default Shadcn Toaster */}
          <Sonner />  {/* Alternative high-performance toast library */}

          <BrowserRouter>
            <Routes>
              {/* Main Landing Page / Pokédex List */}
              <Route path="/" element={<Index />} />
              
              {/* Authentication Page (Login/Register) */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected User Collection Page */}
              <Route path="/favorites" element={<FavoritesPage />} />
              
              {/* Wildcard Route: Catches any undefined URL and shows 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          
        </TooltipProvider>
      </FavoritesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;