import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * NotFound Component
 * * This component acts as the 404 error page. It is rendered whenever a user
 * navigates to a URL that does not match any of the defined routes in the application.
 */
const NotFound = () => {
  // Access the current location object to identify which path caused the error
  const location = useLocation();

  /**
   * Effect Hook: Log the 404 error to the console for debugging purposes.
   * In a production environment, this could be replaced with an error tracking
   * service (like Sentry or LogRocket).
   */
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    /* FULL SCREEN CONTAINER: Centered content using Flexbox */
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        {/* LARGE ERROR CODE */}
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        
        {/* USER-FRIENDLY MESSAGE */}
        <p className="mb-4 text-xl text-muted-foreground">
          Oops! Page not found
        </p>
        
        {/* ESCAPE HATCH: Redirects user back to the dashboard/home */}
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;