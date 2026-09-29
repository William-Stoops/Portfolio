import { Plane } from 'lucide-react';
import { type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type HoldingPatternProps = {
  children: ReactNode;
  // Its width and place in the page: the pattern is a square as wide as it is given.
  className?: string;
};

// A plane in a holding pattern around what it waits for, on a dotted circuit like the flight
// path's: it flies two turns as the page opens and waits at the top, nose to the right
// (motion.css, holding-orbit). For the eyes only: the page says the same in words.
export function HoldingPattern({ children, className }: HoldingPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative mx-auto grid aspect-square w-full place-items-center select-none',
        className,
      )}
    >
      <div className="absolute inset-[9%] rounded-full border-2 border-dotted border-border-input" />
      {children}
      <div data-holding-orbit className="absolute inset-[9%] holding-orbit">
        <span className="absolute top-0 left-1/2 size-11 -translate-1/2 rounded-full bg-canvas">
          {/* The icon's nose points up and to the right: an eighth of a turn heads it along
              the circuit, clockwise. */}
          <Plane
            aria-hidden="true"
            focusable="false"
            strokeWidth={1.75}
            className="size-full rotate-45 p-2 text-accent-fg"
          />
        </span>
      </div>
    </div>
  );
}
