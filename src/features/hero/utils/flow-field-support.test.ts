import { describe, expect, it } from 'vitest';

import { canRunFlowField } from '@/features/hero/utils/flow-field-support';

const MOTION_WELCOME = '(prefers-reduced-motion: no-preference)';

describe('canRunFlowField', () => {
  it('moves the field when motion is welcome and data is not saved', () => {
    expect(canRunFlowField((query) => query === MOTION_WELCOME, false)).toBe(true);
  });

  it('keeps the still gradient when the visitor asks for reduced motion', () => {
    expect(canRunFlowField(() => false, false)).toBe(false);
  });

  it('keeps the still gradient when the visitor saves data', () => {
    expect(canRunFlowField((query) => query === MOTION_WELCOME, true)).toBe(false);
  });
});
