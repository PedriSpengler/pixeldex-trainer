import * as React from "react";

/**
 * The pixel width threshold for mobile devices.
 * 768px is a standard breakpoint for tablets and small screens.
 */
const MOBILE_BREAKPOINT = 768;

/**
 * useIsMobile Hook
 * A custom hook that tracks whether the current window width is below the mobile breakpoint.
 * It uses the MatchMedia API for performance and reliability.
 * * @returns {boolean} True if the viewport is considered mobile, false otherwise.
 */
export function useIsMobile() {
  // Initialize state as undefined to avoid hydration mismatch issues between server and client
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Create a Media Query List (MQL) object for the specified breakpoint
    // Subtracting 1px ensures the boundary is mathematically precise
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    /**
     * Event handler that updates the state based on the current window width.
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add listener to the MQL for real-time window resizing updates
    mql.addEventListener("change", onChange);

    // Initial check to set the state correctly on the first mount
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup function: remove the event listener to prevent memory leaks
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Use double negation (!!) to ensure a boolean return value, even if state is undefined
  return !!isMobile;
}