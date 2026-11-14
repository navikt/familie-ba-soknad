import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

const VERKTØYET = join('src', 'frontend', 'preutfylling');
// Mapper og filer som ikke finnes lenger, hoppes over, slik at testen ikke feiler når noen rydder i repoet.
const MAPPER_MED_KODE = ['src', 'playwright', 'mocks', 'scripts'].filter(existsSync);
const GENERERTE_MAPPER = ['.bygg', 'resultater', 'rapport'].map(navn => join('playwright', navn));
const KONFIGURASJON = [
    'package.json',
    'biome.jsonc',
    'tsconfig.base.json',
    'vite.config.ts',
    'vitest.config.ts',
    'vitest.setup.ts',
    'playwright.config.ts',
    join('src', 'frontend', 'tsconfig.json'),
    join('playwright', 'tsconfig.json'),
].filter(existsSync);
// Filene som havner i hovedbundelen. De skal være små og ikke dra med seg panelet eller kode fra søknaden.
const INNGANGEN = ['index.tsx', 'Feilgrense.tsx', 'skalVisePreutfylling.ts'];

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

// Stier som peker på mappen i en import, en eksport, en dynamisk import, require eller vi.mock. Tekst som bare nevner
// mappen, for eksempel i en kommentar, regnes ikke som bruk.
const STI_TIL_MAPPEN =
    /(?:\bfrom|\bimport|\b(?:require|mock|doMock|importActual|importMock)\s*\()\s*\(?\s*['"`]((?:[^'"`\n]*\/)?preutfylling(?:\/[^'"`\n]*)?)['"`]/g;

const stierTilVerktøyet = (fil: string): string[] =>
    [...readFileSync(fil, 'utf-8').matchAll(STI_TIL_MAPPEN)]
        .map(treff => treff[1])
        .filter(sti => {
            if (!sti.startsWith('.')) {
                // Ikke en relativ sti, altså et alias eller lignende som peker på mappen.
                return true;
            }
            const mål = normalize(join(dirname(fil), sti));
            return mål === VERKTØYET || mål.startsWith(VERKTØYET + sep);
        });

// Både import og «export … from» drar koden med seg inn i hovedbundelen.
const STATISK_IMPORT =
    /^(?:import\s[^'"]*|export\s+(?:type\s+)?(?:\*(?:\s+as\s+\w+)?|\{[^}]*\})\s*from\s*)['"]([^'"]+)['"]/gm;

const statiskeImporter = (fil: string): string[] =>
    [...readFileSync(join(VERKTØYET, fil), 'utf-8').matchAll(STATISK_IMPORT)].map(treff => treff[1]);

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

        expect(KONFIGURASJON, 'Testen fant ikke konfigurasjonen. Oppdater listen i denne testen.').toContain(
            'package.json'
        );
        expect(nevnerVerktøyet, 'Verktøyet skal ikke trenge egen konfigurasjon, for eksempel alias.').toEqual([]);
    });

    it('skal bare ha en liten inngang i hovedbundelen, og laste panelet for seg', () => {
        const importerIInngangen = Object.fromEntries(INNGANGEN.map(fil => [fil, statiskeImporter(fil)]));

        expect(
            importerIInngangen,
            'Inngangen lastes av alle brukere i produksjon. Den skal ikke importere panelet eller kode fra søknaden.'
        ).toEqual({
            'index.tsx': ['react', './Feilgrense', './skalVisePreutfylling'],
            'Feilgrense.tsx': ['react'],
            'skalVisePreutfylling.ts': [],
        });
        const inngangen = readFileSync(join(VERKTØYET, 'index.tsx'), 'utf-8');
        expect(inngangen).toContain("lazy(() => import('./Preutfyllingspanel'))");
        expect(inngangen.match(/\bimport\(/g), 'Inngangen skal bare laste panelet dynamisk.').toHaveLength(1);
    });
});
