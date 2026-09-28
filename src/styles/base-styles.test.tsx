import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

describe('base styles', () => {
  it('loads the one self-hosted family, from its light to its regular weight', async () => {
    const [lightFaces, regularFaces] = await Promise.all([
      document.fonts.load('300 1rem "Inter Tight Variable"'),
      document.fonts.load('400 1rem "Inter Tight Variable"'),
    ]);

    expect(lightFaces.length).toBeGreaterThan(0);
    expect(regularFaces.length).toBeGreaterThan(0);
  });

  it('sets headings in the same family, with balanced wrapping', async () => {
    const screen = await render(<h2>Expérience</h2>);
    const heading = screen.getByRole('heading', { level: 2 }).element();

    expect(getComputedStyle(heading).fontFamily).toContain('Inter Tight Variable');
    expect(getComputedStyle(heading).textWrap).toBe('balance');
  });

  it('sets body text in the same family', async () => {
    const screen = await render(<p>Je décide d'une architecture, je la mesure, je la livre.</p>);
    const paragraph = screen.getByText(/je la livre/).element();

    expect(getComputedStyle(paragraph).fontFamily).toContain('Inter Tight Variable');
  });

  it('draws a 3px solid outline offset by 2px on keyboard focus', async () => {
    const screen = await render(<button type="button">Contact</button>);

    await userEvent.tab();
    const button = screen.getByRole('button', { name: 'Contact' }).element();

    expect(button).toHaveFocus();
    const style = getComputedStyle(button);
    expect(style.outlineStyle).toBe('solid');
    expect(style.outlineWidth).toBe('3px');
    expect(style.outlineOffset).toBe('2px');
  });

  it('underlines links so they are not identified by colour alone', async () => {
    const screen = await render(<a href="https://www.linkedin.com">LinkedIn</a>);
    const link = screen.getByRole('link', { name: 'LinkedIn' }).element();

    expect(getComputedStyle(link).textDecorationLine).toBe('underline');
  });
});
