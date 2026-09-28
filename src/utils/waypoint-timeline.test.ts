import { describe, expect, it } from 'vitest';

import { waypointTimeline } from '@/utils/waypoint-timeline';

describe('waypointTimeline', () => {
  it('names the timeline of a stop or a section after its anchor', () => {
    expect(waypointTimeline('annee-2021')).toBe('--wp-annee-2021');
  });
});
