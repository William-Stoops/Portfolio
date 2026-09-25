import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Badge } from '@/components/ui/badge';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

describe('Badge', () => {
  it('renders its label as plain text', async () => {
    const screen = await render(<Badge>TypeScript</Badge>);

    await expect.element(screen.getByText('TypeScript')).toBeVisible();
  });

  it('has no axe violations', async () => {
    const screen = await render(<Badge>PostgreSQL</Badge>);

    await expectNoAxeViolations(screen.container);
  });
});
