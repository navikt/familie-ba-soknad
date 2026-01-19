import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';
import { DeepPartial } from 'ts-essentials';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';
import * as fnrvalidator from '@navikt/fnrvalidator';

import { ESøknadstype } from '../../../../common/typer/kontrakt/generelle';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/barn';
import { IBarnRespons } from '../../../typer/person';
import { ISøknad } from '../../../typer/søknad';
import { mekkGyldigSøker, silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';

import VelgBarn from './VelgBarn';

vi.mock('@navikt/fnrvalidator');

const manueltRegistrert: Partial<IBarnMedISøknad> = {
    id: 'random-id-1',
    ident: '12345',
    navn: 'A',
    utenlandsperioder: [],
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
        id: OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland,
        svar: ESvar.NEI,
    },
};
const fraPdl: Partial<IBarnRespons> = {
    ident: '54321',
    navn: 'B',
};

const fraPdlSomIBarnMedISøknad: Partial<IBarnMedISøknad> = {
    ...fraPdl,
    navn: fraPdl.navn ?? 'ukjent',
    id: 'random-id-2',
    utenlandsperioder: [],
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
        id: OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland,
        svar: ESvar.NEI,
    },
};

describe('VelgBarn', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });

    test('Kan fjerne manuelt registrerte barn', () => {
        const søknad = {
            barnRegistrertManuelt: [manueltRegistrert],
            barnInkludertISøknaden: [manueltRegistrert, fraPdlSomIBarnMedISøknad],
            søker: { barn: [fraPdl] },
            dokumentasjon: [],
            erEøs: false,
            søknadstype: ESøknadstype.ORDINÆR,
        };
        const { settSøknad } = spyOnUseApp(søknad);

        settSøknad.mockImplementation((nySøknad: ISøknad) => {
            søknad.barnRegistrertManuelt = nySøknad.barnRegistrertManuelt;
            søknad.barnInkludertISøknaden = nySøknad.barnInkludertISøknaden;
        });

        const { getByTestId } = render(
            <TestProvidere mocketNettleserHistorikk={['/velg-barn']}>
                <VelgBarn />
            </TestProvidere>
        );

        const fjernBarnKnapp = getByTestId('fjern-barn-knapp');
        act(() => fjernBarnKnapp.click());

        const gåVidere = getByTestId('neste-steg');
        act(() => gåVidere.click());

        // Først blir barnet fjernet fra manuelt registrerte barn
        expect(settSøknad).toHaveBeenNthCalledWith(1, {
            barnRegistrertManuelt: [],
            barnInkludertISøknaden: [manueltRegistrert, fraPdlSomIBarnMedISøknad],
            søker: {
                ...mekkGyldigSøker(),
                barn: [fraPdl],
            },
            dokumentasjon: [],
            erEøs: false,
            søknadstype: ESøknadstype.ORDINÆR,
        });

        // Når man trykker på gå videre blir det manuelt registrerte barnet fjernet fra søknaden
        expect(settSøknad).toHaveBeenNthCalledWith(2, {
            barnRegistrertManuelt: [],
            barnInkludertISøknaden: [fraPdlSomIBarnMedISøknad],
            søker: {
                ...mekkGyldigSøker(),
                barn: [fraPdl],
            },
            dokumentasjon: [],
            erEøs: false,
            søknadstype: ESøknadstype.ORDINÆR,
        });
    });
    test('Rendrer anonymt barnekort dersom det har adressebeskyttelse', () => {
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
            søknadstype: ESøknadstype.ORDINÆR,
        });

        spyOnUseApp(søknad);

        const { queryByText, queryByTestId } = render(
            <TestProvidere mocketNettleserHistorikk={['/velg-barn']}>
                <VelgBarn />
            </TestProvidere>
        );
        const ident = queryByText(søknad.søker.barn[0].ident ?? 'finnes-ikke-kast-feil');
        const info = queryByTestId('registrert-bosted-adressesperre');

        expect(ident).not.toBeInTheDocument();
        expect(info).toBeInTheDocument();
    });

    test('Kan legge til, fjerne og så legge et barn til igjen', async () => {
        vi.spyOn(fnrvalidator, 'idnr').mockReturnValue({ status: 'valid', type: 'fnr' });

        const søknad = {
            barnRegistrertManuelt: [manueltRegistrert],
            barnInkludertISøknaden: [manueltRegistrert, fraPdlSomIBarnMedISøknad],
            søker: { barn: [fraPdl] },
            dokumentasjon: [],
        };
        const { settSøknad } = spyOnUseApp(søknad);

        settSøknad.mockImplementation((nySøknad: ISøknad) => {
            søknad.barnRegistrertManuelt = nySøknad.barnRegistrertManuelt;
            søknad.barnInkludertISøknaden = nySøknad.barnInkludertISøknaden;
        });

        const { getByTestId, getAllByRole } = render(
            <TestProvidere mocketNettleserHistorikk={['/velg-barn']}>
                <VelgBarn />
            </TestProvidere>
        );

        const fjernBarnKnapp = getByTestId('fjern-barn-knapp');
        act(() => fjernBarnKnapp.click());

        const leggTilBarnKnapp = getByTestId('legg-til-barn-knapp');
        act(() => leggTilBarnKnapp.click());

        const leggTilKnappIModal = getByTestId('submit-knapp-i-modal');

        const jaKnapp = getAllByRole('radio').find(radio => radio.getAttribute('value') === ESvar.JA);
        expect(jaKnapp).toBeDefined();
        act(() => jaKnapp!.click());

        const fornavnInput = getByTestId('legg-til-barn-fornavn');
        const etternavnInput = getByTestId('legg-til-barn-etternavn');
        const idnrInput = getByTestId('legg-til-barn-fnr');

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

        const { getByTestId } = render(
            <TestProvidere mocketNettleserHistorikk={['/velg-barn']}>
                <VelgBarn />
            </TestProvidere>
        );
        const checkbox: HTMLInputElement = getByTestId('søk-om-barnetrygd-for-barn-12345') as HTMLInputElement;
        act(() => checkbox.click());

        expect(checkbox.checked).toBe(true);
    });
});
