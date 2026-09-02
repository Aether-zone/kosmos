import { promises as fs } from 'node:fs';
import path from 'node:path';

import StyleDictionary from 'style-dictionary';

const DIST = 'dist';
const PREFIX = 'kosmos';
const OUTPUT = path.join(DIST, 'tokens.css');

const PRIMITIVES = 'src/tokens/primitives/**/*.json';
const SEMANTIC = [
    'src/tokens/semantic/colors.json',
    'src/tokens/semantic/typography.json',
];

const THEMES = [
    {
        name: 'light',
        // No overrides file: semantic/colors.json already holds the light
        // values, and it is the only complete, $type-annotated semantic set.
        overrides: null,
        selector: ':root',
        // The light pass carries the whole system: primitives, semantic
        // colors and typography all land in :root.
        emit: 'all',
    },
    {
        name: 'dark',
        overrides: 'src/tokens/semantic/dark.json',
        selector: '.dark, [data-theme="dark"]',
        // The dark pass emits only what dark.json actually redefines;
        // everything else stays inherited from :root.
        emit: 'overrides',
    },
];

/** Leaf token paths ("color.primaryForeground") declared in a DTCG file. */
function collectTokenPaths(node, trail = []) {
    return Object.entries(node).flatMap(([key, value]) => {
        if (key.startsWith('$') || value === null || typeof value !== 'object') {
            return [];
        }

        return '$value' in value
            ? [[...trail, key].join('.')]
            : collectTokenPaths(value, [...trail, key]);
    });
}

async function overrideFilter(overrides) {
    const source = JSON.parse(await fs.readFile(overrides, 'utf8'));
    const paths = new Set(collectTokenPaths(source));

    return (token) => paths.has(token.path.join('.'));
}

/**
 * Each theme is built as its own dictionary. Style Dictionary deep-merges all
 * sources into a single token tree, so light.json and dark.json — which
 * declare the same color.* paths — cannot be built together: whichever sorted
 * last would be the only one left standing.
 */
async function buildTheme({ name, overrides, selector, emit }) {
    const destination = `tokens.${name}.css`;

    const sd = new StyleDictionary({
        source: [PRIMITIVES, ...SEMANTIC, ...(overrides ? [overrides] : [])],
        // An overrides pass redeclares every path it themes, which Style
        // Dictionary reports as a collision. That is the whole point here.
        log: emit === 'overrides' ? { warnings: 'disabled' } : undefined,
        platforms: {
            css: {
                transformGroup: 'css',
                prefix: PREFIX,
                buildPath: `${DIST}/`,
                files: [
                    {
                        destination,
                        format: 'css/variables',
                        filter:
                            emit === 'all'
                                ? undefined
                                : await overrideFilter(overrides),
                        options: { selector, showFileHeader: false },
                    },
                ],
            },
        },
    });

    await sd.buildAllPlatforms();

    return path.join(DIST, destination);
}

const header = [
    '/**',
    ' * Do not edit directly, this file was auto-generated.',
    ' */',
    '',
].join('\n');

const parts = [];

for (const theme of THEMES) {
    const file = await buildTheme(theme);

    parts.push((await fs.readFile(file, 'utf8')).trim());

    await fs.rm(file);
}

await fs.writeFile(OUTPUT, `${header}\n${parts.join('\n\n')}\n`);

console.log(`✔ ${OUTPUT}`);
