import React from 'react';

import { render, within } from '@testing-library/react';
import { mockDeep, MockProxy } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput, ESivilstand } from '../../../typer/person';
import { ESøknadstype, ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import DinLivssituasjon from './DinLivssituasjon';
import { DinLivssituasjonSpørsmålId, SamboerSpørsmålId } from './spørsmål';
import { useDinLivssituasjon } from './useDinLivssituasjon';

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
const søknad = {
    søknadstype: ESøknadstype.UTVIDET,
    barnInkludertISøknaden: [
        {
            ident: '1234',
        },
    ],
    søker: {
        sivilstand: { type: ESivilstand.UGIFT },
        utvidet: {
            spørsmål: {
                harSamboerNå: {
                    id: DinLivssituasjonSpørsmålId.harSamboerNå,
                    svar: ESvar.JA,
                },
            },
            nåværendeSamboer: null,
        },
    },
};

const søknadGyldigNåværendeSamboerBase = {
    ...søknad,
    søker: {
        ...søknad.søker,
        utvidet: {
            ...søknad.søker.utvidet,
            nåværendeSamboer: {
                navn: {
                    id: SamboerSpørsmålId.navn,
                    svar: 'Initial verdi for samboer sitt navn',
                },
                ident: {
                    id: SamboerSpørsmålId.fnr,
                    svar: AlternativtSvarForInput.UKJENT,
                },
                fødselsdato: {
                    id: SamboerSpørsmålId.fødselsdato,
                    svar: AlternativtSvarForInput.UKJENT,
                },
                samboerFraDato: {
                    id: SamboerSpørsmålId.samboerFraDato,
                    svar: '01.01.2000',
                },
            },
        },
    },
};

describe('Test av nåværende samboer skjema', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });

    it('preutfyller felter for nåværende samboer fra ISøknad (f eks pga mellomlagring, eller bruk av tilbake knapp)', async () => {
        const søknadMock = mockDeep<ISøknad>(søknadGyldigNåværendeSamboerBase);
        spyOnUseApp(søknadMock);
        const {
            container,
            debug,
            getByRole,
            getByText,
            findByText,
            findByDisplayValue,
            getByLabelText,
        } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        // Navn
        const navn = await findByDisplayValue('Initial verdi for samboer sitt navn');
        expect(navn).toBeInTheDocument();

        // Fnr input felt
        const input = getByLabelText('Fødselsnummer eller d-nummer');
        const fnr = input.closest('input')?.value;
        expect(fnr).toBe('');

        // Ukjent fnr checkbox
        const ukjentFnr = getByLabelText(
            'Jeg kjenner ikke fødselsnummer eller d-nummer (TODO)'
        ) as HTMLInputElement;
        expect(ukjentFnr.value).toBe(ESvar.JA);

        // Fødselsdato
        const fødselsdatoHeader = getByLabelText('Når startet samboerforholdet?');
        const fødselsdato = input.closest('input')?.value;

        expect(fødselsdato).toBe('');

        // Fødselsdato checkbox
        const ukjentFødselsdato = getByLabelText(
            'Jeg kjenner ikke fødselsnummer eller d-nummer (TODO)'
        ) as HTMLInputElement;
        expect(ukjentFødselsdato.value).toBe(ESvar.JA);

        debug(container);

        // Forhold startet dato: expect startDato ===  '01.01.2000'
    });
});
