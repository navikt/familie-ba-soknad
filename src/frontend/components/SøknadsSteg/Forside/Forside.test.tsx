import React from 'react';

import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { AGreen500, ANavRed, AOrange500 } from '@navikt/ds-tokens/dist/tokens';

import {
    mockEøs,
    mockHistory,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import { bekreftelseBoksBorderFarge } from './BekreftelseOgStartSoknad';
import Forside from './Forside';
import { BekreftelseStatus } from './useBekreftelseOgStartSoknad';

describe('Forside', () => {
    beforeEach(() => {
        jest.spyOn(global.console, 'error');
        mockHistory(['/']);
        spyOnUseApp({});
        mockEøs();
    });

    test('Alle tekster finnes i språkfil', async () => {
        await act(async () => {
            render(
                <TestProvidereMedEkteTekster>
                    <Forside />
                </TestProvidereMedEkteTekster>
            );
        });
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    test('Return riktig borderfarge basert på status', () => {
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.FEIL)).toEqual(ANavRed);
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.BEKREFTET)).toEqual(AGreen500);
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.NORMAL)).toEqual(AOrange500);
    });
});
