import {
  defineConfig
} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'
  ],
  format: ['esm'
  ],
  dts: true,
  sourcemap: true,
  clean: true,

  external: [
    'react',
    'react-dom',
  ],

  /**
   * React Server Components need to be told where the client boundary is.
   * Without this, importing anything from the package into a Server
   * Component is a hard error — most of these components use state, refs or
   * portals, and the bundle is a single module, so the directive belongs at
   * the top of it.
   *
   * The cost is that the presentational components become client components
   * too. Splitting them out would mean shipping the module graph unbundled,
   * which breaks under webpack's `fullySpecified` rule for `.mjs`.
   */
  banner: {
    js: "'use client';",
  },

  esbuildOptions(options) {
    options.jsx = 'automatic';
  },

  outDir: 'dist',
});
