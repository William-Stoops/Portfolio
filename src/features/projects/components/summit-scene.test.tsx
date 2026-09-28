import { assert, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { SummitScene } from '@/features/projects/components/summit-scene';
import { PROJECTS as PROJECTS_EN } from '@/features/projects/data/projects.en';
import { PROJECTS } from '@/features/projects/data/projects.fr';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const [STAXX] = PROJECTS;

async function renderScene() {
  return render(<SummitScene photo={STAXX.photo} />);
}

// The dots a path draws: one per "M x y h0".
function dotsIn(paths: readonly Element[]): number {
  return paths.reduce(
    (count, path) => count + (path.getAttribute('d')?.match(/h0/g)?.length ?? 0),
    0,
  );
}

describe('SummitScene', () => {
  it('shows the win as a captioned photo, described once to assistive tech', async () => {
    const screen = await renderScene();

    const figure = screen.getByRole('figure', { name: /^Epitech Summit/ });
    await expect.element(figure.getByRole('img', { name: STAXX.photo.alt })).toBeInTheDocument();
    await expect.element(figure.getByText(STAXX.photo.caption)).toBeVisible();
    // The spotlights show the same photo again: silent copies.
    expect(screen.getByRole('img').elements()).toHaveLength(1);
    expect(screen.container.querySelectorAll('img')).toHaveLength(3);
  });

  it('seats the audience in a room of one dot per person, filled ten at a time', async () => {
    const screen = await renderScene();

    const room = screen.container.querySelector('[data-summit-room]');
    expect(room?.getAttribute('aria-hidden')).toBe('true');
    expect(dotsIn([...(room?.querySelectorAll('[data-seats="empty"]') ?? [])])).toBe(300);
    const ticks = [...(room?.querySelectorAll('[data-seats="taken"]') ?? [])];
    expect(ticks).toHaveLength(30);
    expect(dotsIn(ticks)).toBe(300);
  });

  it('counts the audience up to 300, under its caption from the figures', async () => {
    const screen = await renderScene();

    const strips = [...screen.container.querySelectorAll('[data-digits]')];
    expect(strips.map((strip) => strip.textContent.at(-1)).join('')).toBe('300');
    await expect.element(screen.getByText(STAXX.photo.audience.label)).toBeInTheDocument();
  });

  it('points the spotlights at the winner', async () => {
    const screen = await renderScene();

    const stage = screen.container.querySelector('[data-summit-stage]');
    assert(stage instanceof HTMLElement);
    expect(stage.style.getPropertyValue('--spot-x')).toBe(String(STAXX.photo.spotlight.x));
    expect(stage.style.getPropertyValue('--spot-y')).toBe(String(STAXX.photo.spotlight.y));
  });

  it('keeps the photo lit and the room full where the scene is not pinned', async () => {
    const screen = await renderScene();

    for (const element of screen.container.querySelectorAll('[data-summit-light]')) {
      expect(getComputedStyle(element).display).toBe('none');
    }
  });

  it('tells the English room in English', async () => {
    const screen = await render(<SummitScene photo={PROJECTS_EN[0].photo} />);

    await expect.element(screen.getByText('people at the pitch')).toBeInTheDocument();
    await expect.element(screen.getByText('First place, trophy in hand.')).toBeVisible();
  });

  it('has no axe violations', async () => {
    const screen = await renderScene();

    await expectNoAxeViolations(screen.container);
  });
});
