import React from 'react';

import { act, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';

import OmBarnaDine from './OmBarnaDine';
import { OmBarnaDineSpørsmålId } from './spørsmål';

const søknad = mockDeep<ISøknad>({
    barnInkludertISøknaden: [
        {
            ident: '1234',
            navn: 'Jens',
            id: '123',
        },
    ],
    erNoenAvBarnaFosterbarn: {
        id: OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn,
        svar: ESvar.JA,
    },
    søknadstype: ESøknadstype.ORDINÆR,
});

describe('OmBarnaDine', () => {
    silenceConsoleErrors();
    test('Alle tekster finnes i språkfil', async () => {
        spyOnUseApp(søknad);
        await act(async () => {
            render(
                <TestProvidereMedEkteTekster mocketNettleserHistorikk={['/om-barna']}>
                    <OmBarnaDine />
                </TestProvidereMedEkteTekster>
            );
        });
        expect(console.error).toHaveBeenCalledTimes(0);
    });
});
