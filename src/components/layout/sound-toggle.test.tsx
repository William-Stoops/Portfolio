import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { SoundToggle } from '@/components/layout/sound-toggle';
import { LocaleContext } from '@/i18n/locale-context';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('SoundToggle', () => {
  it('turns the sounds on and off, says which, and plays a tap as they come on', async () => {
    const started = vi.spyOn(OscillatorNode.prototype, 'start');
    const screen = await render(<SoundToggle />);
    const toggle = screen.getByRole('button', { name: 'Sons' });
    await expect.element(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();

    await expect.element(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(localStorage.getItem('sound-preference')).toBe('on');
    await expect.poll(() => started.mock.calls.length).toBe(1);

    await toggle.click();

    await expect.element(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(localStorage.getItem('sound-preference')).toBeNull();
    expect(started).toHaveBeenCalledOnce();
  });

  it('speaks English on the English page, and has no accessibility violations', async () => {
    const screen = await render(
      <LocaleContext value="en">
        <SoundToggle />
      </LocaleContext>,
    );

    await expect.element(screen.getByRole('button', { name: 'Sounds' })).toBeVisible();
    await expectNoAxeViolations(screen.container);
  });
});
