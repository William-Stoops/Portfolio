import { useHeroScene } from '@/features/hero/hooks/use-hero-scene';

// The hero's WebGL surface. Transparent until it has drawn, so the static hero is what
// shows without it (phones, reduced motion, no WebGL). The colour utilities are not styles
// for the canvas itself: the scene reads its two tints from them, straight from the tokens.
// The mask fades it out on the left, under the text, which keeps its contrast.
export function HeroScene() {
  const { canvasRef, isReady } = useHeroScene();

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-ready={isReady ? '' : undefined}
      className="pointer-events-none absolute inset-0 -z-10 size-full border-border-input [mask-image:linear-gradient(to_right,transparent_35%,#000_75%)] text-accent opacity-0 transition-opacity duration-450 ease-out data-ready:opacity-100"
    />
  );
}
