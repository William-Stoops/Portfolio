import { type BrowserType, expect, type Page } from '@playwright/test';

// Below 64rem the section links sit in the menu only; from 64rem they are in the bar too.
const MOBILE_LAYOUT_MAX_WIDTH = 1023;

export function isMobileLayout(page: Page): boolean {
  return (page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) <= MOBILE_LAYOUT_MAX_WIDTH;
}

export async function openMenuIfCollapsed(page: Page): Promise<void> {
  if (isMobileLayout(page)) {
    await openSiteMenu(page);
  }
}

// The quick search, the theme and the other language are in the menu at every width.
export async function openSiteMenu(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Menu' }).click();
}

// Safari only puts links in the Tab order with Option+Tab (or a preference turned on):
// send the key a Safari keyboard user actually presses.
export async function pressTab(
  page: Page,
  browserName: ReturnType<BrowserType['name']>,
): Promise<void> {
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
}

// Opens the quick search with its shortcut. The page listens for it from an effect, just
// after hydration: a press that comes before is lost, so press again until it answers.
export async function pressQuickSearchShortcut(page: Page): Promise<void> {
  await expect(async () => {
    await page.keyboard.press('ControlOrMeta+k');
    await expect(page.getByRole('searchbox')).toBeFocused({ timeout: 3000 });
  }).toPass();
}
