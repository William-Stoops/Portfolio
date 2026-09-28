import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { FlowField } from '@/features/hero/components/flow-field';

async function renderField() {
  const screen = await render(
    <div style={{ position: 'relative', width: 960, height: 600 }}>
      <FlowField />
    </div>,
  );
  const canvas = screen.container.querySelector('canvas');
  if (canvas === null) {
    throw new Error('no canvas');
  }
  return canvas;
}

describe('FlowField', () => {
  it('is a decoration, hidden from assistive tech and from the pointer', async () => {
    const canvas = await renderField();

    expect(canvas.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(getComputedStyle(canvas).pointerEvents).toBe('none');
  });

  it('shows the still gradient of the tokens until the field runs', async () => {
    const canvas = await renderField();

    const band = canvas.parentElement;
    expect(band === null ? '' : getComputedStyle(band).backgroundImage).toContain(
      'radial-gradient',
    );
  });

  it('brings the moving field in once the page is idle, motion being welcome', async () => {
    const canvas = await renderField();

    await expect.poll(() => canvas.hasAttribute('data-live'), { timeout: 5000 }).toBe(true);
    await expect.poll(() => getComputedStyle(canvas).opacity).toBe('1');
  });

  it('carries the four tints of the field for the shader to read', async () => {
    const canvas = await renderField();

    const style = getComputedStyle(canvas);
    expect(
      new Set([style.color, style.borderTopColor, style.borderRightColor, style.borderBottomColor])
        .size,
    ).toBe(4);
  });
});
