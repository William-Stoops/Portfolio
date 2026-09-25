import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { App } from '@/app/app';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

describe('App', () => {
  it('renders a single main landmark titled with William Stoops', async () => {
    const screen = await render(<App />);

    await expect.element(screen.getByRole('main')).toBeVisible();
    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'William Stoops' }))
      .toBeVisible();
  });

  it('marks the English job title with lang="en"', async () => {
    const screen = await render(<App />);

    await expect
      .element(screen.getByText('Software Engineer & AI Engineer'))
      .toHaveAttribute('lang', 'en');
  });

  it('has no axe violations', async () => {
    const screen = await render(<App />);

    await expectNoAxeViolations(screen.container);
  });
});
