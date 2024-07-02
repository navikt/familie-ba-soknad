import React from 'react';

import { act, getAllByText, getByText, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput } from '../../../typer/common';
import { ESivilstand, ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import {
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';

import DinLivssituasjon from './DinLivssituasjon';
import { getAllNåværendeSamboerFields } from './NåværendeSamboerTestUtils';
import { DinLivssituasjonSpørsmålId, SamboerSpørsmålId } from './spørsmål';

const renderDinLivssituasjon = søknad => {
    const søknadMock = mockDeep<ISøknad>(søknad);
    spyOnUseApp(søknadMock);
    return render(
        <TestProvidereMedEkteTekster>
            <DinLivssituasjon />
        </TestProvidereMedEkteTekster>
    );
};

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
            tidligereSamboere: [],
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
                    id: SamboerSpørsmålId.nåværendeSamboerNavn,
                    svar: 'Initial verdi for samboer sitt navn',
                },
                ident: {
                    id: SamboerSpørsmålId.nåværendeSamboerFnr,
                    svar: AlternativtSvarForInput.UKJENT,
                },
                fødselsdato: {
                    id: SamboerSpørsmålId.nåværendeSamboerFødselsdato,
                    svar: AlternativtSvarForInput.UKJENT,
                },
                samboerFraDato: {
                    id: SamboerSpørsmålId.nåværendeSamboerFraDato,
                    svar: '2000-01-01',
                },
            },
        },
    },
};

describe('Test av nåværende samboer skjema', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });

    it('nåværende samboer null initiell verdi', () => {
        const { container } = renderDinLivssituasjon(søknad);
        const [navn, fnr, fnrUkjent, fødselsdato, fødselsdatoUkjent, samboerFraDato] =
            getAllNåværendeSamboerFields(container);

        expect(navn.value).toBe('');
        expect(fnr.value).toBe('');
        expect(fnrUkjent.checked).toBe(false);
        expect(fødselsdato).not.toBeInTheDocument();
        expect(fødselsdatoUkjent).not.toBeInTheDocument();
        expect(samboerFraDato.value).toBe('');
    });

    it('har alle felter riktig og validert ved gyldig nåværende samboer som initiell verdi fra Søknad.', async () => {
        await act(async () => {
            renderDinLivssituasjon(søknadGyldigNåværendeSamboerBase);
        });

        const container: HTMLElement = document.body;

        const [navn, fnr, fnrUkjent, fødselsdato, fødselsdatoUkjent, samboerFraDato] =
            getAllNåværendeSamboerFields(container);
        const gåVidere = getByText(container, 'Gå videre');

        expect(navn.value).toBe('Initial verdi for samboer sitt navn');
        expect(fnr.value).toBe('');
        expect(fnr.disabled).toBe(true);
        expect(fnrUkjent.checked).toBe(true);
        expect(fødselsdato.value).toBe('');
        expect(fødselsdato.disabled).toBe(true);
        expect(fødselsdatoUkjent.checked).toBe(true);
        expect(samboerFraDato.value).toBe('01.01.2000');

        act(() => {
            fnrUkjent.click();
        });

        expect(fnr.disabled).toBe(false);
        expect(fødselsdato).not.toBeInTheDocument();
        expect(fødselsdatoUkjent).not.toBeInTheDocument();

        act(() => gåVidere.click());

        //Feilmelding dukker både opp under spørsmålet og i feiloppsummeringen
        const antallFeilmeldingerPerFeil = 2;
        const fnrFeil: HTMLElement[] | null = getAllByText(
            container,
            'Du må oppgi samboerens fødselsnummer eller d-nummer for å gå videre'
        );
        expect(fnrFeil).toHaveLength(antallFeilmeldingerPerFeil);
    });
});
