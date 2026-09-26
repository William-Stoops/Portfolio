import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { useProgressiveRender } from '@/hooks/use-progressive-render';

function Page() {
  useProgressiveRender();
  return (
    <>
      <a href="#b">Aller à B</a>
      <section className="defer-render" data-testid="a">
        A
      </section>
      <section className="defer-render" data-testid="b" id="b">
        B
      </section>
    </>
  );
}

afterEach(() => {
  document.documentElement.removeAttribute('data-render-all');
});

describe('useProgressiveRender', () => {
  it('schedules no rendering while the page idles', async () => {
    await render(<Page />);

    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(document.documentElement.hasAttribute('data-render-all')).toBe(false);
  });

  it('renders everything at once before the visitor jumps to an anchor', async () => {
    const screen = await render(<Page />);

    screen
      .getByRole('link')
      .element()
      .dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

    expect(document.documentElement.hasAttribute('data-render-all')).toBe(true);
  });

  it('renders everything at once as soon as the keyboard is used', async () => {
    await render(<Page />);

    await userEvent.keyboard('{Tab}');

    expect(document.documentElement.hasAttribute('data-render-all')).toBe(true);
  });

  it('renders everything at once on the first scroll', async () => {
    await render(<Page />);

    window.dispatchEvent(new Event('scroll'));

    expect(document.documentElement.hasAttribute('data-render-all')).toBe(true);
  });
});
