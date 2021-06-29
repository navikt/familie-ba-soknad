import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { DeepPartial } from 'ts-essentials';

import { byggSuksessRessurs } from '@navikt/familie-typer';
import fnrvalidator from '@navikt/fnrvalidator';

import { IBarn, IBarnRespons } from '../../../typer/person';
import { ISøknad } from '../../../typer/søknad';
import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import VelgBarn from './VelgBarn';

jest.mock('@navikt/fnrvalidator');

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: '/velg-barn',
    }),
    useHistory: () => ({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        push: () => {},
    }),
}));

const manueltRegistrert: Partial<IBarn> = {
    id: 'random-id-1',
    ident: '12345',
    navn: 'A',
};
const fraPdl: Partial<IBarnRespons> = {
    ident: '54321',
    navn: 'B',
};

const fraPdlSomIBarn: Partial<IBarn> = {
    ...fraPdl,
    id: 'random-id-2',
};

describe('VelgBarn', () => {
    test('Kan fjerne manuelt registrerte barn', () => {
        silenceConsoleErrors();
        const søknad = {
            barnRegistrertManuelt: [manueltRegistrert],
            barnInkludertISøknaden: [manueltRegistrert, fraPdlSomIBarn],
            søker: { barn: [fraPdl] },
            dokumentasjon: [],
        };
        const { settSøknad } = spyOnUseApp(søknad);

        settSøknad.mockImplementation((nySøknad: ISøknad) => {
            søknad.barnRegistrertManuelt = nySøknad.barnRegistrertManuelt;
            søknad.barnInkludertISøknaden = nySøknad.barnInkludertISøknaden;
        });

        const { getByText } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );
        const fjernBarnKnapp = getByText(/hvilkebarn.fjern-barn.knapp/);

        act(() => fjernBarnKnapp.click());

        const gåVidere = getByText(/felles.navigasjon.gå-videre/);
        act(() => gåVidere.click());

        // Først blir barnet fjernet fra manuelt registrerte barn
        expect(settSøknad).toHaveBeenNthCalledWith(1, {
            barnRegistrertManuelt: [],
            barnInkludertISøknaden: [manueltRegistrert, fraPdlSomIBarn],
            søker: { barn: [fraPdl] },
            dokumentasjon: [],
        });

        // Når man trykker på gå videre blir det manuelt registrerte barnet fjernet fra søknaden
        expect(settSøknad).toHaveBeenNthCalledWith(2, {
            barnRegistrertManuelt: [],
            barnInkludertISøknaden: [fraPdlSomIBarn],
            søker: { barn: [fraPdl] },
            dokumentasjon: [],
        });
    });

    test('Rendrer ikke barn med adressebeskyttelse, rendrer infoblokk', () => {
        silenceConsoleErrors();
        const søknad = mockDeep<ISøknad>({
            søker: {
                barn: [
                    {
                        adressebeskyttelse: true,
                        ident: '12345678901',
                    },
                ],
            },
            barnInkludertISøknaden: [],
        });

        spyOnUseApp(søknad);

        const { queryByText } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );
        const ident = queryByText(søknad.søker.barn[0].ident ?? 'finnes-ikke-kast-feil');
        const infoTekst = queryByText(/hvilkebarn.adressesperreinformasjon/);

        expect(ident).not.toBeInTheDocument();
        expect(infoTekst).toBeInTheDocument();
    });

    test('Kan legge til, fjerne og så legge et barn til igjen', async () => {
        silenceConsoleErrors();
        jest.spyOn(fnrvalidator, 'idnr').mockReturnValue({ status: 'valid', type: 'fnr' });

        const søknad = {
            barnRegistrertManuelt: [manueltRegistrert],
            barnInkludertISøknaden: [manueltRegistrert, fraPdl],
            søker: { barn: [fraPdl] },
            dokumentasjon: [],
        };
        const { settSøknad, axiosRequestMock } = spyOnUseApp(søknad);
        axiosRequestMock.mockReturnValue(byggSuksessRessurs(false));

        settSøknad.mockImplementation((nySøknad: ISøknad) => {
            søknad.barnRegistrertManuelt = nySøknad.barnRegistrertManuelt;
            søknad.barnInkludertISøknaden = nySøknad.barnInkludertISøknaden;
        });

        const { getByText, getByLabelText } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );

        const fjernBarnKnapp = getByText(/hvilkebarn.fjern-barn.knapp/);
        act(() => fjernBarnKnapp.click());

        const leggTilBarnKnapp = getByText(/hvilkebarn.leggtilbarn.kort.knapp/);
        act(() => leggTilBarnKnapp.click());

        const modal = getByLabelText('hvilkebarn.leggtilbarn.modal.tittel');
        const leggTilKnappIModal = modal.querySelector('button');

        const jaKnapp = getByText('felles.svaralternativ.ja');
        act(() => jaKnapp.click());

        const fornavnLabel = getByText('hvilkebarn.leggtilbarn.fornavn.spm');
        const etternavnLabel = getByText('hvilkebarn.leggtilbarn.etternavn.spm');
        const idnrLabel = getByText('felles.fødsels-eller-dnummer.label');
        expect(fornavnLabel).toBeInTheDocument();
        expect(etternavnLabel).toBeInTheDocument();
        expect(idnrLabel).toBeInTheDocument();
        const fornavnInput = fornavnLabel.nextElementSibling || new Element();
        const etternavnInput = etternavnLabel.nextElementSibling || new Element();
        const idnrInput = idnrLabel.nextElementSibling || new Element();

        act(() => {
            fireEvent.input(fornavnInput, { target: { value: manueltRegistrert.navn } });
            fireEvent.input(etternavnInput, { target: { value: 'whatever' } });
            fireEvent.input(idnrInput, { target: { value: manueltRegistrert.ident } });
        });

        await act(() => leggTilKnappIModal?.click());

        expect(søknad.barnRegistrertManuelt.length).toBe(1);
        // Først fjernet vi barnet, så la vi det til igjen
        expect(settSøknad).toHaveBeenCalledTimes(2);
    });

    test('Kan huke av for barn', () => {
        silenceConsoleErrors();

        const søknad: DeepPartial<ISøknad> = {
            søker: {
                barn: [
                    {
                        navn: 'Jens',
                        ident: '12345',
                        adressebeskyttelse: false,
                        borMedSøker: true,
                        alder: '2 år',
                    },
                ],
            },
            barnRegistrertManuelt: [],
        };
        spyOnUseApp(søknad);

        const { getByLabelText } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );
        const checkbox: HTMLInputElement = getByLabelText(
            /hvilkebarn.barn.søk-om.spm/
        ) as HTMLInputElement;
        act(() => checkbox.click());

        expect(checkbox.checked).toBe(true);
    });
});
