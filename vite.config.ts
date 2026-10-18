import { defineConfig } from 'vite';

// Relative base so the build works on any static host sub-path (and later inside the WP theme).
export default defineConfig({
  base: './',
  build: { target: 'es2022' },
});
