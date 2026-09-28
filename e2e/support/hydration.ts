import { type Page } from '@playwright/test';

// Built pages arrive prerendered and React hydrates them a moment later: until then a key
// press has no listener and a form submits natively (the page reloads). React attaches
// its props to the elements it has hydrated: the header's controls are on every page.
export async function waitForHydration(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const control = document.querySelector('header button, header a');
    return control !== null && Object.keys(control).some((key) => key.startsWith('__reactProps'));
  });
}
