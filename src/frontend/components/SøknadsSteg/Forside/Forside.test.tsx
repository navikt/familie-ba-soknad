import { AGreen500, ANavRed, AOrange500 } from '@navikt/ds-tokens/dist/tokens';

import { mockEøs, mockHistory, spyOnUseApp } from '../../../utils/testing';

import { bekreftelseBoksBorderFarge } from './BekreftelseOgStartSoknad';
import { BekreftelseStatus } from './useBekreftelseOgStartSoknad';

describe('Forside', () => {
    beforeEach(() => {
        jest.spyOn(global.console, 'error');
        mockHistory(['/']);
        spyOnUseApp({});
        mockEøs();
    });

    test('Return riktig borderfarge basert på status', () => {
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.FEIL)).toEqual(ANavRed);
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.BEKREFTET)).toEqual(AGreen500);
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.NORMAL)).toEqual(AOrange500);
    });
});
