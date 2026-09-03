import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Copies the two stylesheets that are not compiled by Tailwind.
 *
 * `styles.css` — the precompiled bundle consumers import — is produced by the
 * Tailwind CLI in the package's build script; see src/tailwind.css for why.
 */
const DIST = 'dist';

await fs.mkdir(DIST, { recursive: true });

await fs.copyFile(
    require.resolve('@kosmos/tokens/tokens.css'),
    path.join(DIST, 'tokens.css'),
);

// The raw token -> Tailwind mapping, for consumers who compile their own
// Tailwind and want to extend or override it.
await fs.copyFile(
    path.join('src', 'styles.css'),
    path.join(DIST, 'theme.css'),
);

console.log('\u2714 dist/tokens.css, dist/theme.css');
