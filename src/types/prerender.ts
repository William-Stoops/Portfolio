// Contract between src/entry-server.tsx and scripts/prerender.ts. The script loads the entry
// through Vite's module runner, which cannot check types at runtime: both sides import this
// type so a signature change breaks the type check on each of them.
export type RenderRoute = (path: string) => Promise<string>;
