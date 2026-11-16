import { describe, expect, it } from 'vitest';

import { Avvik, feilmeldingForUgyldigKombinasjon, Scenario } from '../scenario';

describe('feilmeldingForUgyldigKombinasjon', () => {
    it('skal godta fosterbarn sammen med valg som ikke gjelder den andre forelderen', () => {
        expect(
            feilmeldingForUgyldigKombinasjon({
                scenario: Scenario.EØS_SØKER,
                avvik: [Avvik.FOSTERBARN, Avvik.INSTITUSJON],
            })
        ).toBeUndefined();
    });

    it('skal avvise fosterbarn sammen med avtale om delt bosted', () => {
        expect(
            feilmeldingForUgyldigKombinasjon({
                scenario: Scenario.ORDINÆR,
                avvik: [Avvik.FOSTERBARN, Avvik.DELT_BOSTED],
            })
        ).toBeDefined();
    });

    it('skal avvise fosterbarn når den andre forelderen arbeider i et EØS-land', () => {
        expect(
            feilmeldingForUgyldigKombinasjon({ scenario: Scenario.EØS_ANDRE_FORELDER, avvik: [Avvik.FOSTERBARN] })
        ).toBeDefined();
    });
});
