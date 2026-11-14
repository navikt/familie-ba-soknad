import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { skalVisePreutfylling } from './skalVisePreutfylling';

const fantIngenHoster = (fil: string) =>
    `Fant ingen ingresser i .nais/${fil}. Oppdater hosterFraNais i denne testen, se src/frontend/preutfylling/README.md.`;

const hosterFraNais = (fil: string): string[] => {
    const linjer = readFileSync(join('.nais', fil), 'utf-8').split('\n');
    const start = linjer.findIndex(linje => /^\s*ingresses:/.test(linje));
    const hoster: string[] = [];
    for (const linje of linjer.slice(start + 1)) {
        if (/^\s*(#.*)?$/.test(linje)) {
            continue;
        }
        const treff = linje.match(/^\s*-\s*"?https?:\/\/([^/"\s]+)/);
        if (!treff) {
            break;
        }
        hoster.push(treff[1]);
    }
    return hoster;
};

describe('skalVisePreutfylling', () => {
    it('skal aldri vise panelet på hostene appen har i produksjon', () => {
        const hosterIProduksjon = hosterFraNais('app-prod.yaml');

        expect(hosterIProduksjon.length, fantIngenHoster('app-prod.yaml')).toBeGreaterThan(0);
        for (const hostname of hosterIProduksjon) {
            expect(skalVisePreutfylling({ hostname, search: '' })).toBe(false);
            expect(skalVisePreutfylling({ hostname, search: '?preutfylling' })).toBe(false);
        }
    });

    it('skal vise panelet på hostene appen har i preprod', () => {
        const hosterIPreprod = hosterFraNais('app-dev.yaml');

        expect(hosterIPreprod.length, fantIngenHoster('app-dev.yaml')).toBeGreaterThan(0);
        for (const hostname of hosterIPreprod) {
            expect(skalVisePreutfylling({ hostname, search: '' })).toBe(true);
        }
    });

    it.each([
        'www.nav.no',
        'nav.no',
        'familie-ba-soknad.intern.nav.no',
        'familie-ba-soknad.ansatt.dev.nav.no.eksempel.no',
        'dev.nav.no',
        'eksempel.no',
    ])('skal ikke vise panelet på %s', hostname => {
        expect(skalVisePreutfylling({ hostname, search: '?preutfylling' })).toBe(false);
    });

    it.each(['localhost', '127.0.0.1'])('skal vise panelet på %s når adressen har ?preutfylling', hostname => {
        expect(skalVisePreutfylling({ hostname, search: '?preutfylling' })).toBe(true);
    });

    it.each(['localhost', '127.0.0.1'])('skal ikke vise panelet på %s uten ?preutfylling', hostname => {
        expect(skalVisePreutfylling({ hostname, search: '' })).toBe(false);
    });
});
