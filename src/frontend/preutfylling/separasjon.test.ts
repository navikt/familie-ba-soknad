import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

const VERKTØYET = join('src', 'frontend', 'preutfylling');
const MAPPER_MED_KODE = ['src', 'playwright', 'mocks', 'scripts'];
const GENERERTE_MAPPER = ['.bygg', 'resultater', 'rapport'].map(navn => join('playwright', navn));
const KONFIGURASJON = ['vite.config.ts', 'vitest.config.ts', 'vitest.setup.ts', 'playwright.config.ts'];

const kodefiler = (mappe: string): string[] =>
    readdirSync(mappe).flatMap(navn => {
        const sti = join(mappe, navn);
        if (sti === VERKTØYET || GENERERTE_MAPPER.includes(sti)) {
            return [];
        }
        if (statSync(sti).isDirectory()) {
            return kodefiler(sti);
        }
        return /\.[cm]?[jt]sx?$/.test(navn) ? [sti] : [];
    });

// Alle relative stier i koden, uansett om de står i en import, en dynamisk import, require eller vi.mock.
const RELATIV_STI = /['"`](\.{1,2}\/[^'"`\n]*)['"`]/g;

const stierTilVerktøyet = (fil: string): string[] =>
    [...readFileSync(fil, 'utf-8').matchAll(RELATIV_STI)]
        .map(treff => treff[1])
        .filter(sti => {
            const mål = normalize(join(dirname(fil), sti));
            return mål === VERKTØYET || mål.startsWith(VERKTØYET + sep);
        });

// Verktøyet skal være lett å slette. Stedene under er derfor de eneste som får bruke det, se README.md.
describe('Preutfylling er skilt fra resten av søknaden', () => {
    it('skal bare brukes fra App.tsx og sin egen ende-til-ende-test', () => {
        const brukere = Object.fromEntries(
            MAPPER_MED_KODE.flatMap(kodefiler)
                .map(fil => [fil, stierTilVerktøyet(fil)] as const)
                .filter(([, stier]) => stier.length > 0)
        );

        expect(
            brukere,
            'Annen kode skal ikke bruke testverktøyet. App.tsx skal bare importere inngangen, slik at panelet ikke ' +
                'havner i hovedbundelen. Se src/frontend/preutfylling/README.md.'
        ).toEqual({
            [join('playwright', 'tester', 'preutfylling.spec.ts')]: ['../../src/frontend/preutfylling/scenario'],
            [join('src', 'frontend', 'App.tsx')]: ['./preutfylling'],
        });
    });

    it('skal ikke være nevnt i konfigurasjonen til bygg og tester', () => {
        const nevnerVerktøyet = KONFIGURASJON.filter(fil => readFileSync(fil, 'utf-8').includes('preutfylling'));

        expect(nevnerVerktøyet, 'Verktøyet skal ikke trenge egen konfigurasjon, for eksempel alias.').toEqual([]);
    });
});
