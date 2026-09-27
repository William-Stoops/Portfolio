import { expect, type Page } from '@playwright/test';

// Built pages arrive prerendered and React hydrates them a moment later, part by part:
// until then a key press has no listener and a form submits natively (the page reloads).
// React attaches its props to the elements it has hydrated: by default the header's
// controls, on every page; or the element about to be used.
export async function waitForHydration(page: Page, selector = 'header button'): Promise<void> {
  await page.waitForFunction((target) => {
    const element = document.querySelector(target);
    return element !== null && Object.keys(element).some((key) => key.startsWith('__reactProps'));
  }, selector);
}

// Renders every deferred section, as a visitor's first key press does (ADR 0018). The
// listener comes with an effect that runs just after hydration: until it has, the press
// is lost, so press again until the page renders them all.
export async function renderEverySection(page: Page): Promise<void> {
  await waitForHydration(page);
  await expect(async () => {
    await page.keyboard.press('Shift');
    await expect(page.locator('html')).toHaveAttribute('data-render-all', { timeout: 500 });
  }).toPass();
}
