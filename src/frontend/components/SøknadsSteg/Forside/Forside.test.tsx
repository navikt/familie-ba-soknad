import { BorderDanger, BorderSuccess, BorderWarning } from '@navikt/ds-tokens/dist/tokens';

import { bekreftelseBoksBorderFarge } from './BekreftelseOgStartSoknad';
import { BekreftelseStatus } from './useBekreftelseOgStartSoknad';

describe('Forside', () => {
    test('Return riktig borderfarge basert på status', () => {
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.FEIL)).toEqual(BorderDanger);
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.BEKREFTET)).toEqual(BorderSuccess);
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.NORMAL)).toEqual(BorderWarning);
    });
});
