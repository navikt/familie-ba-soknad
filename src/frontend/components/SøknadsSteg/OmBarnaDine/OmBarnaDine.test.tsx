import React from 'react';

import { act, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import { ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnModal,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';

import OmBarnaDine from './OmBarnaDine';
import { OmBarnaDineSpørsmålId } from './spørsmål';

/*jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: '/om-barna',
    }),
    useNavigate: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        push: () => {},
    }),
}));*/

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
});

describe('OmBarnaDine', () => {
    silenceConsoleErrors();
    test('Alle tekster finnes i språkfil', async () => {
        spyOnUseApp(søknad);
        spyOnModal();
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
