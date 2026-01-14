import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Interface for NavLinkCompatProps.
 * Extends standard NavLinkProps but replaces the functional 'className' 
 * with a simple string to allow for legacy-style 'activeClassName' props.
 */
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;        // Base styles applied to the link
  activeClassName?: string;  // Styles applied specifically when the link is active
  pendingClassName?: string; // Styles applied while the link transition is pending
}

/**
 * NavLink Component
 * A compatibility wrapper for React Router's NavLink.
 * * It uses `forwardRef` to ensure that the underlying HTML Anchor element
 * can be accessed by parent components (useful for tooltips or focus management).
 * * Instead of forcing the user to use a function inside `className`, 
 * this component uses the `cn` utility to merge classes based on the link's state.
 */
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        /**
         * React Router v6 provides a callback for className.
         * We extract isActive and isPending to conditionally apply
         * the classes passed via props.
         */
        className={({ isActive, isPending }) =>
          cn(
            className, 
            isActive && activeClassName, 
            isPending && pendingClassName
          )
        }
        {...props}
      />
    );
  },
);

// Component name assigned for better debugging in React DevTools
NavLink.displayName = "NavLink";

export { NavLink };