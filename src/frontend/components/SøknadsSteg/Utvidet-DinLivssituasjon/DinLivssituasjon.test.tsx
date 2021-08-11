import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ISøknad } from '../../../typer/søknad';
import {
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
} from '../../../utils/testing';
import DinLivssituasjon from './DinLivssituasjon';
import { DinLivssituasjonSpørsmålId } from './spørsmål';

describe('DinLivssituasjon', () => {
    it('Stopper fra å gå videre hvis siden har mangler', () => {
        const søknad = mockDeep<ISøknad>({
            søker: {
                utvidet: {
                    årsak: {
                        id: DinLivssituasjonSpørsmålId.årsak,
                        svar: '',
                    },
                },
            },
        });
        spyOnUseApp(søknad);
        const { mockedHistoryArray } = mockHistory(['/din-livssituasjon']);

        silenceConsoleErrors();

        const { getByText, getAllByRole, debug, container } = render(
            <TestProvidere>
                <DinLivssituasjon />
            </TestProvidere>
        );

        const gåVidere = getByText('felles.navigasjon.gå-videre');
        act(() => gåVidere.click());

        debug(container, 100000);

        const omDegFeil = getAllByRole('alert')[0];

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual({ hash: 'omdeg-feil' });
        expect(omDegFeil).toBeInTheDocument();
        expect(omDegFeil).toBeVisible();
    });
});
