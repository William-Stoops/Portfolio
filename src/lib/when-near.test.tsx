import { afterEach, describe, expect, it, vi } from 'vitest';

import { whenNear } from '@/lib/when-near';

afterEach(() => {
  document.querySelectorAll('[data-test-fixture]').forEach((element) => {
    element.remove();
  });
  window.scrollTo(0, 0);
});

// An element far below the fold, after a tall spacer.
function renderFarElement(): HTMLElement {
  const spacer = document.createElement('div');
  spacer.dataset['testFixture'] = '';
  spacer.style.height = '5000px';
  const element = document.createElement('div');
  element.dataset['testFixture'] = '';
  element.style.height = '10px';
  document.body.append(spacer, element);
  return element;
}

async function afterObserversRan(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
}

describe('whenNear', () => {
  // The test page runs in an iframe, which clips what lies below its viewport before the
  // margin applies: the element is brought on screen, the margin is the browser's job.
  it('waits for the element to come near, then runs once', async () => {
    const element = renderFarElement();
    const callback = vi.fn<() => void>();

    whenNear(element, callback, '400px');
    await afterObserversRan();
    expect(callback).not.toHaveBeenCalled();

    window.scrollTo(0, element.offsetTop - window.innerHeight / 2);
    await expect.poll(() => callback.mock.calls.length).toBe(1);
    window.scrollTo(0, 0);
    window.scrollTo(0, element.offsetTop);
    await afterObserversRan();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('never runs once cancelled', async () => {
    const element = renderFarElement();
    const callback = vi.fn<() => void>();

    whenNear(element, callback, '400px')();
    window.scrollTo(0, element.offsetTop);
    await afterObserversRan();

    expect(callback).not.toHaveBeenCalled();
  });
});
