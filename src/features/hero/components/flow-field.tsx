import { useFlowField } from '@/features/hero/hooks/use-flow-field';

// The living field of the hero (ADR 0037): a band of colour cut on a slant, the still
// gradient of four tokens first, the shader's flowing blend faded in over it once it runs.
// The canvas carries the tints for the shader to read (text and border colours), so the
// field follows the theme without a colour of its own.
export function FlowField() {
  const { canvasRef, isLive } = useFlowField();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 flow-band -z-10">
      <canvas
        ref={canvasRef}
        data-live={isLive ? '' : undefined}
        className="block size-full border-t-flow-blue border-r-flow-violet border-b-flow-peach text-flow-sky opacity-0 transition-opacity duration-450 ease-out data-live:opacity-100"
      />
    </div>
  );
}
