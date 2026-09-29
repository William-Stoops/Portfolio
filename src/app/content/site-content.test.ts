import { describe, expect, it } from 'vitest';

import { loadSiteContent } from '@/app/content/load-site-content';
import { type SiteContent } from '@/app/content/site-content';
import { SITE_CONTENT as SITE_CONTENT_EN } from '@/app/content/site-content.en';
import { SITE_CONTENT as SITE_CONTENT_FR } from '@/app/content/site-content.fr';

// What must not change from one language to the other: the same items, in the same order.
function structureOf(content: SiteContent) {
  return {
    sections: Object.keys(content),
    heroKeywords: content.hero.keywords,
    aboutMetrics: content.about.metrics.map(({ visual }) => visual),
    journey: content.journey.stops.map(({ year, note }) => ({ year, hasNote: note !== undefined })),
    experiences: content.experiences.entries.map(({ id, period, stack }) => ({
      id,
      period,
      stack,
    })),
    race: content.experiences.race.times,
    koreaPhotos: content.korea.photos.map(({ picture }) => picture),
    projects: content.projects.entries.map(({ id, period }) => ({ id, period })),
    aiPractices: content.aiPractice.items.length,
    skills: content.skills.groups.map(({ id, skills }) => ({ id, count: skills.length })),
    education: content.skills.education.entries.map(({ id, period }) => ({ id, period })),
  };
}

describe('site content', () => {
  it('tells the same story in both languages', () => {
    expect(structureOf(SITE_CONTENT_EN)).toEqual(structureOf(SITE_CONTENT_FR));
  });

  it('anchors every section in the language of its page', () => {
    expect(
      [SITE_CONTENT_FR, SITE_CONTENT_EN].map((content) => [
        content.about.id,
        content.journey.id,
        content.aiPractice.id,
        content.skills.id,
        content.contact.id,
      ]),
    ).toEqual([
      ['a-propos', 'parcours', 'ia', 'competences', 'contact'],
      ['about', 'journey', 'ai', 'skills', 'contact'],
    ]);
  });

  it('describes every page of each language', () => {
    for (const content of [SITE_CONTENT_FR, SITE_CONTENT_EN]) {
      for (const text of [
        content.home.description,
        content.behindTheScenes.description,
        content.accessibility.description,
        content.legalNotice.description,
        content.siteMap.description,
      ]) {
        expect(text.length).toBeGreaterThan(50);
        expect(text.length).toBeLessThanOrEqual(160);
      }
    }
  });

  it('loads the content of the page’s locale, and only that one', async () => {
    await expect(loadSiteContent('fr')).resolves.toBe(SITE_CONTENT_FR);
    await expect(loadSiteContent('en')).resolves.toBe(SITE_CONTENT_EN);
  });
});
