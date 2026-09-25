import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

describe('expectNoAxeViolations', () => {
  it('passes for accessible markup', async () => {
    const screen = await render(
      <main>
        <h1>Accessible title</h1>
      </main>,
    );

    await expectNoAxeViolations(screen.container);
  });

  it('fails and names the rule for inaccessible markup', async () => {
    const screen = await render(<section />);
    // Built through the DOM API on purpose: this fixture must be inaccessible.
    const imageWithoutAlt = document.createElement('img');
    imageWithoutAlt.src = '/portrait.avif';
    screen.container.append(imageWithoutAlt);

    await expect(expectNoAxeViolations(screen.container)).rejects.toThrow(/image-alt/);
  });
});
