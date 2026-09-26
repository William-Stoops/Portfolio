import { mkdir } from 'node:fs/promises';

import sharp, { type Sharp } from 'sharp';

import { PORTRAIT_PICTURE } from '../src/features/hero/data/portrait-picture.ts';
import {
  BASEBALL_STADIUM_PICTURE,
  HANOK_CAFE_PICTURE,
  NIGHT_PAVILION_PICTURE,
} from '../src/features/korea/data/korea-pictures.ts';
import {
  NRJ_EXPLANATION_PICTURE,
  NRJ_INTERVIEW_PICTURE,
  PITCH_PICTURE,
  SUMMIT_PICTURE,
} from '../src/features/projects/data/staxx-pictures.ts';
import { type ImageFormat, type ResponsivePicture } from '../src/types/responsive-picture.ts';
import { buildImageUrl } from '../src/utils/responsive-picture.ts';

// Run with `pnpm images` when a source image changes, then commit public/images: the build
// does not depend on sharp, and URLs stay identical in prerendered HTML and on the client.
const IMAGE_JOBS: readonly { source: URL; picture: ResponsivePicture }[] = [
  {
    source: new URL('../docs/content/images/william-stoops-portrait.jpg', import.meta.url),
    picture: PORTRAIT_PICTURE,
  },
  {
    source: new URL('../docs/content/images/staxx-pitch.jpg', import.meta.url),
    picture: PITCH_PICTURE,
  },
  {
    source: new URL('../docs/content/images/staxx-epitech-summit.jpg', import.meta.url),
    picture: SUMMIT_PICTURE,
  },
  {
    source: new URL('../docs/content/images/staxx-nrj-lille-interview.jpg', import.meta.url),
    picture: NRJ_INTERVIEW_PICTURE,
  },
  {
    source: new URL('../docs/content/images/staxx-nrj-lille-explanation.jpg', import.meta.url),
    picture: NRJ_EXPLANATION_PICTURE,
  },
  {
    source: new URL('../docs/content/images/korea-baseball-stadium.jpg', import.meta.url),
    picture: BASEBALL_STADIUM_PICTURE,
  },
  {
    source: new URL('../docs/content/images/korea-hanok-cafe.jpg', import.meta.url),
    picture: HANOK_CAFE_PICTURE,
  },
  {
    source: new URL('../docs/content/images/korea-night-pavilion.jpg', import.meta.url),
    picture: NIGHT_PAVILION_PICTURE,
  },
];

const PUBLIC_DIRECTORY = new URL('../public/', import.meta.url);

// Quality tuned per codec for the same perceived quality (AVIF compresses best).
const ENCODERS: Readonly<Record<ImageFormat, (image: Sharp) => Sharp>> = {
  avif: (image) => image.avif({ quality: 55, effort: 9 }),
  webp: (image) => image.webp({ quality: 75, effort: 6 }),
  jpg: (image) => image.jpeg({ quality: 78, mozjpeg: true }),
};

await mkdir(new URL('images/', PUBLIC_DIRECTORY), { recursive: true });

await Promise.all(
  IMAGE_JOBS.flatMap(({ source, picture }) =>
    picture.widths.flatMap((width) =>
      picture.formats.map(async (format) => {
        const target = new URL(`.${buildImageUrl(picture, width, format)}`, PUBLIC_DIRECTORY);
        const output = await ENCODERS[format](
          sharp(source.pathname).resize({ width, withoutEnlargement: true }),
        ).toFile(target.pathname);
        process.stdout.write(`${target.pathname} (${String(output.size)} B)\n`);
      }),
    ),
  ),
);
