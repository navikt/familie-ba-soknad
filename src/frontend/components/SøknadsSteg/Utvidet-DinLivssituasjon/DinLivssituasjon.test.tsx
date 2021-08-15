import React from 'react';

import { queryByText, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ESøknadstype, ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import DinLivssituasjon from './DinLivssituasjon';
import { DinLivssituasjonSpørsmålId } from './spørsmål';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: '/din-livssituasjon',
    }),
    useHistory: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        push: () => {},
    }),
}));

jest.mock('nav-frontend-alertstriper', () => ({ children }) => (
    <div data-testid="alertstripe">{children}</div>
));

describe('DinLivssituasjon', () => {
    beforeEach(() => {
        silenceConsoleErrors();
        const søknad = mockDeep<ISøknad>({
            søknadstype: ESøknadstype.UTVIDET,
            barnInkludertISøknaden: [
                {
                    ident: '1234',
                },
            ],
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
    });

    it('rendrer DinLivssituasjon steg og inneholder sidetittel', () => {
        const { getByText } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        expect(getByText('Din livssituasjon')).toBeInTheDocument();
    });

    it('Stopper fra å gå videre hvis årsak ikke er valgt', () => {
        const { getByText, getByRole } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        const gåVidere = getByText('GÅ VIDERE');
        act(() => gåVidere.click());
        const alerts: HTMLElement = getByRole('alert');
        const result: HTMLElement | null = queryByText(
            alerts,
            'Hvorfor søker du om utvidet barnetrygd?'
        );
        expect(result).not.toBeNull();
    });
});
