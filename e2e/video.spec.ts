import { expect, test } from '@playwright/test';

const YOUTUBE_HOSTS = /(^|\.)(youtube(-nocookie)?\.com|ytimg\.com|googlevideo\.com)$/;

test.describe('pitch video', () => {
  test('contacts no YouTube host while the visitor has not asked for the video', async ({
    page,
  }) => {
    const youtubeRequests: string[] = [];
    page.on('request', (request) => {
      if (YOUTUBE_HOSTS.test(new URL(request.url()).hostname)) {
        youtubeRequests.push(request.url());
      }
    });

    await page.goto('/fr#projets');
    await expect(page.getByRole('button', { name: /^Lire la vidéo/ })).toBeVisible();

    expect(youtubeRequests).toEqual([]);
  });

  test('opens on the frame the pitch starts with, served by the site itself', async ({ page }) => {
    await page.goto('/fr#projets');
    const poster = page.getByRole('button', { name: /^Lire la vidéo/ }).locator('img');

    await poster.scrollIntoViewIfNeeded();

    await expect
      .poll(() =>
        poster.evaluate(
          (image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const source = await poster.evaluate((image) =>
      image instanceof HTMLImageElement ? image.currentSrc : '',
    );
    expect(new URL(source).origin).toBe(new URL(page.url()).origin);
    expect(new URL(source).pathname).toMatch(/^\/images\/staxx-pitch-v1-/);
  });

  test('plays the privacy-enhanced player right where the poster was', async ({ page }) => {
    // The player's own network traffic is not what this test is about.
    await page.route(/youtube-nocookie\.com/, (route) => route.fulfill({ status: 204 }));
    await page.goto('/fr#projets');
    const playButton = page.getByRole('button', { name: /^Lire la vidéo/ });
    await playButton.scrollIntoViewIfNeeded();
    const posterBox = await playButton.boundingBox();

    await playButton.click();

    const player = page.getByTitle('Pitch de STAXX au concours Epitech Summit');
    await expect(player).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/K_TsQ0Itoek?start=3741&autoplay=1',
    );
    await expect(player).toBeFocused();
    // In the page, in the poster's frame: no dialog, no other player.
    const playerBox = await player.boundingBox();
    expect(playerBox?.width).toBeCloseTo(posterBox?.width ?? 0, 0);
    expect(playerBox?.height).toBeCloseTo(posterBox?.height ?? 0, 0);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
