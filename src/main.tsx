import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // Global styles, Tailwind directives, and pixel-art fonts

/**
 * Main Entry Point
 * ----------------
 * 1. document.getElementById("root"): Searches the DOM for an element with the ID 'root'.
 * The '!' is a TypeScript non-null assertion, telling the compiler that we are
 * certain this element exists in our index.html.
 * * 2. createRoot: Initializes a React root, enabling concurrent features available in React 18+.
 * * 3. render(<App />): Injects the main App component into the root element.
 */
createRoot(document.getElementById("root")!).render(<App />);