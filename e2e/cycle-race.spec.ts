import { expect, type Locator, type Page, test } from '@playwright/test';

// The race under the lab's surface, in the journey (its code loads as hydration reaches it):
// the region named by its title.
async function openRace(page: Page, path: string, title: string): Promise<Locator> {
  await page.goto(path);
  const race = page.getByRole('region', { name: title });
  await race.scrollIntoViewIfNeeded();
  return race;
}

// A click before hydration finds no handler: press until the race answers.
async function startRace(race: Locator, start: string, restart: string): Promise<void> {
  await expect(async () => {
    await race.getByRole('button', { name: start }).click();
    await expect(race.getByRole('button', { name: restart })).toBeVisible({ timeout: 500 });
  }).toPass();
}

test.describe('the cycle race', () => {
  test('races the old cycle against the new one to scale, then says the result', async ({
    page,
  }) => {
    test.setTimeout(45_000);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const race = await openRace(page, '/fr', 'Un cycle complet, à l’échelle');

    await startRace(race, 'Lancer les deux calculs', 'Relancer les deux calculs');

    // The new version is done with its first cycle at once, and counts on while the old
    // one crawls through its ten hours, twelve seconds to scale.
    await expect(race.getByText(/^\d+ cycles$/)).toBeVisible();
    await expect(race.getByRole('status')).toBeEmpty();
    await expect(race.getByRole('status')).toHaveText(
      /^Pendant qu’un cycle d’avant s’achève, la version refondue en boucle 120\s: des valeurs de nouveau à jour\.$/,
      { timeout: 20_000 },
    );
    await expect(race.getByText('120 cycles')).toBeVisible();
    await expect(race.getByText('1 / 1 cycle')).toBeVisible();
    await expect(race.getByText('Temps simulé : 10 h 00')).toBeVisible();
  });

  test('gives the result at once when the visitor asks for reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const race = await openRace(page, '/fr', 'Un cycle complet, à l’échelle');

    await startRace(race, 'Lancer les deux calculs', 'Relancer les deux calculs');

    await expect(race.getByText('120 cycles')).toBeVisible();
    await expect(race.getByRole('status')).toContainText('en boucle 120');
  });

  test('races in English on the English page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const race = await openRace(page, '/en', 'One full cycle, to scale');

    await startRace(race, 'Run both computations', 'Run them again');

    await expect(race.getByRole('status')).toHaveText(
      'While one old cycle completes, the redesigned version runs 120: values up to date again.',
    );
  });
});
