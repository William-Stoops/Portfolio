import { fileURLToPath, URL } from 'node:url';

import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Under Vitest the compiler is off: its memo-cache branches would be counted by coverage
// as untested source branches. The compiled output is exercised by the E2E suite, which
// runs against the production build, and guarded by the react-hooks compiler lint rules.
const IS_VITEST = process.env['VITEST'] === 'true';

export default defineConfig({
  // The React Compiler runs through Babel (stable path); the Rust port is still experimental.
  plugins: [
    react(),
    ...(IS_VITEST ? [] : [babel({ presets: [reactCompilerPreset()] })]),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    sourcemap: true,
  },
});
