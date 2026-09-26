import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ReturnStage } from '@/features/korea/components/return-stage';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderStage() {
  return render(<ReturnStage content={KOREA_CONTENT} />);
}

describe('ReturnStage', () => {
  it('flies back west, from Seoul to France, as decoration', async () => {
    const screen = await renderStage();

    const route = screen.container.querySelector('[data-flight-route]');
    expect(route?.getAttribute('aria-hidden')).toBe('true');
    expect(route?.getAttribute('data-direction')).toBe('west');
  });

  it('lands on the French flag, its three bands drawn as decoration', async () => {
    const screen = await renderStage();

    const flag = screen.container.querySelector('[data-flag="france"]');
    expect(flag?.getAttribute('aria-hidden')).toBe('true');
    expect(flag?.querySelectorAll('[data-band]')).toHaveLength(3);
  });

  it('says goodbye in Korean and hello in French, each read once', async () => {
    const screen = await renderStage();

    const farewells = screen
      .getByText(KOREA_CONTENT.homecoming.farewell.korean, { exact: true })
      .elements();
    expect(farewells.every((farewell) => farewell.getAttribute('lang') === 'ko')).toBe(true);
    expect(farewells.filter((farewell) => !farewell.closest('[aria-hidden="true"]'))).toHaveLength(
      1,
    );
    const greetings = screen
      .getByText(KOREA_CONTENT.homecoming.greeting, { exact: true })
      .elements();
    expect(greetings.filter((greeting) => !greeting.closest('[aria-hidden="true"]'))).toHaveLength(
      1,
    );
  });

  it('has no axe violations', async () => {
    const screen = await renderStage();

    await expectNoAxeViolations(screen.container);
  });
});
