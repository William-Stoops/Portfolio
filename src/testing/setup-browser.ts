// Registers `page.render` / `page.renderHook` types and loads the real stylesheet so that
// component tests assert against the same CSS the site ships.
import 'vitest-browser-react';
import '@/styles/globals.css';
