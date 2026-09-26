// Lets components set CSS custom properties inline (`style={{ '--i': index }}`), typed,
// without casting: motion.css reads them to stagger and size animations.
declare module 'react' {
  interface CSSProperties {
    [customProperty: `--${string}`]: string | number | undefined;
  }
}

// A module file: the declaration above augments React's types instead of replacing them.
export {};
