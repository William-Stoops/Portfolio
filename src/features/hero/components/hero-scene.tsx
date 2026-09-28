import { type SceneVariant, useHeroScene } from '@/features/hero/hooks/use-hero-scene';

type HeroSceneProps = { variant?: SceneVariant };

// Where each variant fades out: under the hero's text column, or towards the top and the
// sides of the contact section, whose texts keep their contrast.
const MASK_CLASS_NAMES: Readonly<Record<SceneVariant, string>> = {
  hero: '[mask-image:linear-gradient(to_right,transparent_35%,#000_75%)]',
  finale: '[mask-image:radial-gradient(ellipse_55%_40%_at_50%_75%,#000_40%,transparent_100%)]',
};

// The WebGL surface: in the hero, and settled down behind the contact section to close
// the page. Transparent until it has drawn, so the static page is what shows without it
// (phones, reduced motion, no WebGL). The colour utilities are not styles for the canvas
// itself: the scene reads its two tints from them, straight from the tokens.
export function HeroScene({ variant = 'hero' }: HeroSceneProps) {
  const { canvasRef, isReady } = useHeroScene(variant);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-ready={isReady ? '' : undefined}
      className={`pointer-events-none absolute inset-0 -z-10 size-full border-border-input text-accent opacity-0 transition-opacity duration-450 ease-out data-ready:opacity-100 ${MASK_CLASS_NAMES[variant]}`}
    />
  );
}
