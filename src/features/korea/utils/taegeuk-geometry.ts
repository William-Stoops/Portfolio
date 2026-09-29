// The flag of South Korea, to its official construction (the proportions of the
// public-domain reference drawing): a field 72 units by 48, a taegeuk of radius 12 in its
// centre, and the four trigrams on the diagonals, their middle bar 22 units out. Each
// trigram is its own element, so it can arrive on the compositor; this module gives its
// bars, its place in the field and its tilt.

const FIELD_WIDTH = 72;
const FIELD_HEIGHT = 48;
const TRIGRAM_DISTANCE = 22;
const TRIGRAM_WIDTH = 12;
const TRIGRAM_HEIGHT = 8;
// Bars: 12 units long, 3 apart; a broken bar leaves a gap of 1 unit in its middle.
const BAR_HALF_LENGTH = 6;
const BAR_HALF_GAP = 0.5;
const BAR_SPACING = 3;

// The diagonals of a 3:2 field lean atan(2 / 3) from the horizontal.
const DIAGONAL_TILT = (Math.atan2(2, 3) * 180) / Math.PI;
// Trigram bars lie across their diagonal.
const FALLING_DIAGONAL = DIAGONAL_TILT - 90;
const RISING_DIAGONAL = -DIAGONAL_TILT - 90;

type Bar = 'whole' | 'broken';
type Corner = -1 | 1;

const TRIGRAM_DEFINITIONS: readonly {
  name: string;
  bars: readonly [Bar, Bar, Bar];
  corner: readonly [Corner, Corner];
}[] = [
  { name: 'geon', bars: ['whole', 'whole', 'whole'], corner: [-1, -1] },
  { name: 'gam', bars: ['broken', 'whole', 'broken'], corner: [1, -1] },
  { name: 'ri', bars: ['whole', 'broken', 'whole'], corner: [-1, 1] },
  { name: 'gon', bars: ['broken', 'broken', 'broken'], corner: [1, 1] },
];

function formatNumber(value: number): string {
  return String(Number(value.toFixed(3)));
}

function barPath(bar: Bar, y: number): string {
  const row = formatNumber(y);
  const at = (x: number): string => `${formatNumber(x)}${y < 0 ? '' : ' '}${row}`;
  return bar === 'whole'
    ? `M${at(-BAR_HALF_LENGTH)}H${String(BAR_HALF_LENGTH)}`
    : `M${at(-BAR_HALF_LENGTH)}H${String(-BAR_HALF_GAP)}M${at(BAR_HALF_GAP)}H${String(BAR_HALF_LENGTH)}`;
}

function percent(value: number): string {
  return `${value.toFixed(3)}%`;
}

export const TRIGRAMS = TRIGRAM_DEFINITIONS.map(({ name, bars, corner: [x, y] }) => {
  // Top left and bottom right lie on the falling diagonal, the other two on the rising one.
  const tilt = x === y ? FALLING_DIAGONAL : RISING_DIAGONAL;
  const radians = (DIAGONAL_TILT * Math.PI) / 180;
  const centreX = FIELD_WIDTH / 2 + x * TRIGRAM_DISTANCE * Math.cos(radians);
  const centreY = FIELD_HEIGHT / 2 + y * TRIGRAM_DISTANCE * Math.sin(radians);
  return {
    name,
    path: bars.map((bar, index) => barPath(bar, (index - 1) * BAR_SPACING)).join(''),
    left: percent(((centreX - TRIGRAM_WIDTH / 2) * 100) / FIELD_WIDTH),
    top: percent(((centreY - TRIGRAM_HEIGHT / 2) * 100) / FIELD_HEIGHT),
    rotate: `${tilt.toFixed(3)}deg`,
    // Arriving from beyond its corner, two of its own sizes away.
    from: `${String(x * 200)}% ${String(y * 200)}%`,
  };
});

// The taegeuk is drawn on the falling diagonal: red above, blue below.
export const TAEGEUK_ROTATION = `rotate(${FALLING_DIAGONAL.toFixed(3)})`;
