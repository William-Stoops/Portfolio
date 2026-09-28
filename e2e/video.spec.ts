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

    await page.goto('/#projets');
    await expect(page.getByRole('button', { name: /^Lire la vidéo/ })).toBeVisible();

    expect(youtubeRequests).toEqual([]);
  });

  test('opens on the frame the pitch starts with, served by the site itself', async ({ page }) => {
    await page.goto('/#projets');
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

  test('plays the privacy-enhanced player over the whole screen, until Escape', async ({
    page,
  }) => {
    // The player's own network traffic is not what this test is about.
    await page.route(/youtube-nocookie\.com/, (route) => route.fulfill({ status: 204 }));
    await page.goto('/#projets');
    const playButton = page.getByRole('button', { name: /^Lire la vidéo/ });

    await playButton.click();

    const dialog = page.getByRole('dialog', { name: 'Pitch de STAXX au concours Epitech Summit' });
    const player = dialog.locator('iframe');
    await expect(player).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/K_TsQ0Itoek?start=3741&autoplay=1',
    );
    // The largest 16:9 box that fits: it spans the width on a portrait phone and most of
    // the height on a landscape screen.
    const viewport = page.viewportSize();
    const box = await player.boundingBox();
    expect(viewport).not.toBeNull();
    expect(box).not.toBeNull();
    if (viewport !== null && box !== null) {
      const widthShare = box.width / viewport.width;
      const heightShare = box.height / viewport.height;
      expect(Math.max(widthShare, heightShare)).toBeGreaterThan(0.75);
    }

    await page.keyboard.press('Escape');

    await expect(dialog).toBeHidden();
    await expect(player).toHaveCount(0);
  });

  test('stays dark in the light theme', async ({ page }) => {
    await page.route(/youtube-nocookie\.com/, (route) => route.fulfill({ status: 204 }));
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/#projets');

    await page.getByRole('button', { name: /^Lire la vidéo/ }).click();

    // The dark canvas token: the production CSS transpiles light-dark(), which must still
    // follow the dialog's own colour scheme.
    await expect(page.getByRole('dialog')).toHaveCSS('background-color', 'rgb(27, 31, 42)');
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(250, 250, 247)');
  });
});
