import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Props for the Pagination component.
 */
interface PaginationProps {
  currentPage: number;    // The currently active page
  totalPages: number;     // Total number of available pages
  onPageChange: (page: number) => void; // Callback function to handle page switching
}

/**
 * Pagination Component
 * Renders a retro-styled pagination bar with dynamic range calculation.
 * It shows a limited number of page buttons and handles "..." ellipses for large sets.
 */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const maxVisible = 5; // Maximum number of numeric page buttons to show at once
  
  // Logic to calculate the sliding window of visible page numbers
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  
  // Adjust the start point if we are near the end of the total pages
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  // Populate the array of page numbers to be rendered
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* PREVIOUS PAGE BUTTON */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-2 border-border retro-button disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* FIRST PAGE & ELLIPSIS: Shown if the start of our range is past page 1 */}
      {start > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            className="font-pixel text-[10px] border-2 border-border retro-button"
          >
            1
          </Button>
          {start > 2 && <span className="text-muted-foreground font-pixel text-xs">...</span>}
        </>
      )}

      {/* DYNAMIC PAGE NUMBERS */}
      {pages.map(page => (
        <Button
          key={page}
          // Highlight the button if it matches the current active page
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={`font-pixel text-[10px] border-2 retro-button ${
            page === currentPage 
              ? "bg-primary border-primary" 
              : "border-border"
          }`}
        >
          {page}
        </Button>
      ))}

      {/* LAST PAGE & ELLIPSIS: Shown if the end of our range hasn't reached the total count */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-muted-foreground font-pixel text-xs">...</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="font-pixel text-[10px] border-2 border-border retro-button"
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* NEXT PAGE BUTTON */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-2 border-border retro-button disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}