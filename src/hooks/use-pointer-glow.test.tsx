import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { usePointerGlow } from '@/hooks/use-pointer-glow';

function Harness() {
  usePointerGlow();
  return (
    <div>
      <div data-pointer data-testid="card" style={{ width: 200, height: 100 }}>
        <span data-testid="inside">Carte</span>
      </div>
      <div data-testid="outside" style={{ width: 200, height: 100 }} />
    </div>
  );
}

function movePointer(target: Element, clientX: number, clientY: number, pointerType = 'mouse') {
  target.dispatchEvent(
    new PointerEvent('pointermove', { bubbles: true, clientX, clientY, pointerType }),
  );
}

function pointerVariables(element: HTMLElement | SVGElement) {
  return ['--pointer-x', '--pointer-y', '--pointer-rx', '--pointer-ry'].map((name) =>
    element.style.getPropertyValue(name),
  );
}

describe('usePointerGlow', () => {
  it('gives a [data-pointer] element the pointer position, in px and around its centre', async () => {
    const screen = await render(<Harness />);
    const card = screen.getByTestId('card').element();
    const { left, top } = card.getBoundingClientRect();

    movePointer(screen.getByTestId('inside').element(), left + 150, top + 25);

    expect(pointerVariables(card)).toEqual(['150px', '25px', '0.5', '-0.5']);
  });

  it('clears the position once the pointer leaves the element', async () => {
    const screen = await render(<Harness />);
    const card = screen.getByTestId('card').element();
    const { left, top } = card.getBoundingClientRect();
    movePointer(card, left + 10, top + 10);

    movePointer(screen.getByTestId('outside').element(), left + 10, top + 150);

    expect(pointerVariables(card)).toEqual(['', '', '', '']);
  });

  it('clears the position when the pointer leaves the window', async () => {
    const screen = await render(<Harness />);
    const card = screen.getByTestId('card').element();
    const { left, top } = card.getBoundingClientRect();
    movePointer(card, left + 10, top + 10);

    document.documentElement.dispatchEvent(new PointerEvent('pointerleave'));

    expect(pointerVariables(card)).toEqual(['', '', '', '']);
  });

  it('ignores touch, which has no hover', async () => {
    const screen = await render(<Harness />);
    const card = screen.getByTestId('card').element();
    const { left, top } = card.getBoundingClientRect();

    movePointer(card, left + 10, top + 10, 'touch');

    expect(pointerVariables(card)).toEqual(['', '', '', '']);
  });
});
