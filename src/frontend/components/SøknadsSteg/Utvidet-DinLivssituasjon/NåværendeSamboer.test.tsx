import React from 'react';

import { queryByAttribute, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

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

const getById = queryByAttribute.bind(null, 'id');

const getNavn = (container: Element) =>
    getById(container as HTMLElement, 'utvidet-nåværende-samboer-navn') as HTMLInputElement;
const getFnr = (container: Element) =>
    getById(container as HTMLElement, 'utvidet-nåværende-samboer-ident') as HTMLInputElement;
const getFnrUkjent = (container: Element) =>
    getById(container as HTMLElement, 'utvidet-nåværende-samboer-identUkjent') as HTMLInputElement;
const getFødselsdato = (container: Element) =>
    getById(container as HTMLElement, 'utvidet-nåværende-samboer-fødselsdato') as HTMLInputElement;
const getFødselsdatoUkjent = (container: Element) =>
    getById(
        container as HTMLElement,
        'utvidet-nåværende-samboer-fødselsdatoUkjent'
    ) as HTMLInputElement;
const getSamboerFraDato = (container: Element) =>
    getById(
        container as HTMLElement,
        'utvidet-nåværende-samboer-samboerFraDato'
    ) as HTMLInputElement;

const getAllNåværendeSamboerFields = (container: Element) => {
    return [
        getNavn(container),
        getFnr(container),
        getFnrUkjent(container),
        getFødselsdato(container),
        getFødselsdatoUkjent(container),
        getSamboerFraDato(container),
    ];
};

const valideringsStatusIdNavn = 'status-validering-navn';
const valideringsStatusIdFnr = 'status-validering-fnr';
const valideringsStatusIdFnrUkjent = 'status-validering-fnr-ukjent';
const valideringsStatusIdFødselsdato = 'status-validering-fødselsdato';
const valideringsStatusIdFødselsdatoUkjent = 'status-validering-fødselsdato-ukjent';
const valideringsStatusIdSamboerFraDato = 'status-validering-samboer-fra-dato';

const getValideringsStatus = container => {
    return {
        navnStatus: getById(container, valideringsStatusIdNavn) as HTMLElement,
        fnrStatus: getById(container, valideringsStatusIdFnr) as HTMLElement,
        fnrUkjentStatus: getById(container, valideringsStatusIdFnrUkjent) as HTMLElement,
        fødselsdatoStatus: getById(container, valideringsStatusIdFødselsdato) as HTMLElement,
        fødselsdatoUkjentStatus: getById(
            container,
            valideringsStatusIdFødselsdatoUkjent
        ) as HTMLElement,
        samboerFraDatoStatus: getById(container, valideringsStatusIdSamboerFraDato) as HTMLElement,
    };
};

const ValideringsStatusOversikt = () => {
    const { skjema } = useDinLivssituasjon();
    return (
        <div>
            <div id={valideringsStatusIdNavn}>
                {skjema.felter.nåværendeSamboerNavn.valideringsstatus}
            </div>
            <div id={valideringsStatusIdFnr}>
                {skjema.felter.nåværendeSamboerFnr.valideringsstatus}
            </div>
            <div id={valideringsStatusIdFnrUkjent}>
                {skjema.felter.nåværendeSamboerFnrUkjent.valideringsstatus}
            </div>
            <div id={valideringsStatusIdFødselsdato}>
                {skjema.felter.nåværendeSamboerFødselsdato.valideringsstatus}
            </div>
            <div id={valideringsStatusIdFødselsdatoUkjent}>
                {skjema.felter.nåværendeSamboerFødselsdatoUkjent.valideringsstatus}
            </div>
            <div id={valideringsStatusIdSamboerFraDato}>
                {skjema.felter.nåværendeSamboerFraDato.valideringsstatus}
            </div>
        </div>
    );
};

const renderDinLivssituasjon = søknad => {
    const søknadMock = mockDeep<ISøknad>(søknad);
    spyOnUseApp(søknadMock);
    return render(
        <TestProvidereMedEkteTekster>
            <ValideringsStatusOversikt />
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

    it('nåværende samboer null initiell verdi', () => {
        const { container, debug } = renderDinLivssituasjon(søknad);
        const [
            navn,
            fnr,
            fnrUkjent,
            fødselsdato,
            fødselsdatoUkjent,
            samboerFraDato,
        ] = getAllNåværendeSamboerFields(container);

        expect(navn.value).toBe('');
        expect(fnr.value).toBe('');
        expect(fnrUkjent.value).toBe(ESvar.NEI);
        expect(fødselsdato).not.toBeInTheDocument();
        expect(fødselsdatoUkjent).not.toBeInTheDocument();
        expect(samboerFraDato.value).toBe('');
    });

    it('har alle felter riktig og validert ved gyldig nåværende samboer som initiell verdi fra Søknad.', () => {
        const { container, getByText } = renderDinLivssituasjon(søknadGyldigNåværendeSamboerBase);
        const [
            navn,
            fnr,
            fnrUkjent,
            fødselsdato,
            fødselsdatoUkjent,
            samboerFraDato,
        ] = getAllNåværendeSamboerFields(container);

        expect(navn.value).toBe('Initial verdi for samboer sitt navn');
        expect(fnr.value).toBe('');
        expect(fnrUkjent.value).toBe(ESvar.JA);
        expect(fødselsdato.value).toBe('');
        expect(fødselsdatoUkjent.value).toBe(ESvar.JA);
        expect(samboerFraDato.value).toBe('01.01.2000');

        const {
            navnStatus,
            fnrStatus,
            fnrUkjentStatus,
            fødselsdatoStatus,
            fødselsdatoUkjentStatus,
            samboerFraDatoStatus,
        } = getValideringsStatus(container);

        expect(navnStatus.textContent).toBe('OK');
        expect(fnrStatus.textContent).toBe('OK');
        expect(fnrUkjentStatus.textContent).toBe('OK');
        expect(fødselsdato.textContent).toBe('OK');
        expect(fødselsdatoStatus.textContent).toBe('OK');
        expect(samboerFraDatoStatus.textContent).toBe('OK');
    });
});
