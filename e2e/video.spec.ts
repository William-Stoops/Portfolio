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

  test('mounts the privacy-enhanced player on demand', async ({ page }) => {
    // The player's own network traffic is not what this test is about.
    await page.route(/youtube-nocookie\.com/, (route) => route.fulfill({ status: 204 }));
    await page.goto('/#projets');

    await page.getByRole('button', { name: /^Lire la vidéo/ }).click();

    const player = page.locator('iframe[title="Pitch de STAXX au concours Epitech Summit"]');
    await expect(player).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/K_TsQ0Itoek?start=3741&autoplay=1',
    );
  });
});
