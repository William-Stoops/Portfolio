import * as z from 'zod/mini';

const ENTRY_KEY = 'index.html';

// The part of Vite's build manifest (build.manifest) the prerender reads: each module's
// output file and the chunks it imports statically.
const viteManifestSchema = z.record(
  z.string(),
  z.object({ file: z.string(), imports: z.optional(z.array(z.string())) }),
);

type ViteManifest = z.infer<typeof viteManifestSchema>;

export function parseViteManifest(json: string): ViteManifest {
  return viteManifestSchema.parse(JSON.parse(json));
}

// Every chunk a module needs, itself first, following its static imports.
function chunkClosure(manifest: ViteManifest, key: string, seen: Set<string>): void {
  const chunk = manifest[key];
  if (chunk === undefined) {
    throw new Error(`${key} is not in the build manifest`);
  }
  if (seen.has(key)) {
    return;
  }
  seen.add(key);
  for (const imported of chunk.imports ?? []) {
    chunkClosure(manifest, imported, seen);
  }
}

// What a page must preload for a dynamically imported module (the locale's content), so it
// downloads in parallel with the entry: that module's chunks, minus what the entry already
// loads.
export function chunkPreloads(manifest: ViteManifest, moduleKey: string): readonly string[] {
  const loadedByEntry = new Set<string>();
  chunkClosure(manifest, ENTRY_KEY, loadedByEntry);
  const needed = new Set<string>();
  chunkClosure(manifest, moduleKey, needed);
  return [...needed]
    .filter((key) => !loadedByEntry.has(key))
    .map((key) => `/${manifest[key]?.file ?? key}`);
}
