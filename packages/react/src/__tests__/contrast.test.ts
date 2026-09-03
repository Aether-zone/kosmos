import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const css = readFileSync(require.resolve('@kosmos/tokens/tokens.css'), 'utf8');

/** The custom properties declared in one selector block. */
function block(selector: string) {
    const pattern = new RegExp(
        `${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{(.*?)\\}`,
        's',
    );
    const body = pattern.exec(css)?.[1] ?? '';

    return Object.fromEntries(
        [...body.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map(
            ([, name, value]) => [name, value.trim()],
        ),
    );
}

const light = block(':root');
const dark = { ...light, ...block('.dark, [data-theme="dark"]') };

function luminance(hex: string) {
    const channels = [1, 3, 5].map((i) =>
        Number.parseInt(hex.slice(i, i + 2), 16) / 255,
    );

    const [r, g, b] = channels.map((c) =>
        c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
    );

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
    const [x, y] = [luminance(a), luminance(b)];

    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const colour = (theme: Record<string, string>, role: string) => {
    const value = theme[`kosmos-color-${role}`];

    if (!value) {
        throw new Error(`No token for colour role "${role}"`);
    }

    return value;
};

/** Every fill that carries its own label. */
const FILLS = [
    'primary',
    'secondary',
    'accent',
    'destructive',
    'success',
    'warning',
    'surface',
];

/** Colours used as body text, against every surface they can sit on. */
const TEXT = ['foreground', 'muted-foreground', 'warning-emphasis', 'destructive-emphasis'];
const SURFACES = ['background', 'surface', 'muted', 'accent'];

const AA = 4.5;
/** WCAG 1.4.11: visual information identifying a control. */
const NON_TEXT = 3;

/** Boundaries a user has to see to find or focus a control. */
const CONTROL_EDGES = ['input', 'ring'];

/**
 * The a11y story tests only ever render the light theme, so without this the
 * dark palette is unverified — and it shipped with white on blue-500 at
 * 3.7:1. Checking the tokens directly covers both themes at once, and covers
 * pairings no story happens to render.
 */
describe.each([
    ['light', light],
    ['dark', dark],
])('%s theme meets WCAG AA', (_name, theme) => {
    it.each(FILLS)('%s fill carries its foreground', (role) => {
        const ratio = contrast(
            colour(theme, `${role}-foreground`),
            colour(theme, role),
        );

        expect(ratio).toBeGreaterThanOrEqual(AA);
    });

    it.each(TEXT.flatMap((fg) => SURFACES.map((bg) => [fg, bg] as const)))(
        '%s is readable on %s',
        (fg, bg) => {
            const ratio = contrast(colour(theme, fg), colour(theme, bg));

            expect(ratio).toBeGreaterThanOrEqual(AA);
        },
    );

    // Text contrast alone let control borders ship at 1.3:1 — visible enough
    // to a designer looking for them, invisible to anyone who is not.
    it.each(
        CONTROL_EDGES.flatMap((edge) =>
            SURFACES.map((bg) => [edge, bg] as const),
        ),
    )('%s is discernible against %s', (edge, bg) => {
        const ratio = contrast(colour(theme, edge), colour(theme, bg));

        expect(ratio).toBeGreaterThanOrEqual(NON_TEXT);
    });
});

/**
 * Opacity on a text colour blends it toward whatever is behind, so it always
 * *reduces* contrast — and a hover or disabled state owes the same 4.5:1 as
 * the resting one. `text-primary/80` shipped at 3.6:1 on the light surface
 * and 2.8:1 on the dark one before this caught it.
 *
 * Backgrounds are exempt: `bg-primary/10` is a deliberate tint, and the text
 * sitting on it is checked above.
 */
describe('the compiled stylesheet', () => {
    it('never sets a text colour through transparency', () => {
        const stylesheet = readFileSync(
            new URL('../../dist/styles.css', import.meta.url),
            'utf8',
        );

        // Anchored on the property, so `border-color` is not mistaken for
        // `color`; the value may contain a nested var(), so it runs to the
        // end of the declaration rather than the first bracket.
        const offenders = [
            ...stylesheet.matchAll(
                /([^{}]+)\{(?:[^{}]*?;)?color:color-mix\([^;}]*transparent\)/g,
            ),
        ].map(([, selector]) => selector.trim());

        expect(offenders).toEqual([]);
    });
});
