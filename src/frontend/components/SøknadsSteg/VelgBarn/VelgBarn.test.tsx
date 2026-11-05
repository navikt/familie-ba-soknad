import { ESvar } from '@navikt/familie-form-elements';
import * as fnrvalidator from '@navikt/fnrvalidator';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { DeepPartial } from 'ts-essentials';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { ESøknadstype } from '../../../../common/typer/kontrakt/generelle';
import { barnDataKeySpørsmål, type IBarnMedISøknad } from '../../../typer/barn';
import type { IBarnRespons } from '../../../typer/person';
import type { ISøknad } from '../../../typer/søknad';
import {
    hentSpørsmål,
    hentSvaralternativ,
    mekkGyldigSøker,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
} from '../../../utils/testing';
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

        render(
            <TestProvidere mocketNettleserHistorikk={['/velg-barn']}>
                <VelgBarn />
            </TestProvidere>
        );

        const fjernBarnKnapp = screen.getByRole('button', { name: 'FELLES.modaler.leggTilBarn.fjernKnapp' });
        act(() => fjernBarnKnapp.click());

        const gåVidere = screen.getByRole('button', { name: 'FELLES.navigasjon.gaaVidereKnapp' });
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

        render(
            <TestProvidere mocketNettleserHistorikk={['/velg-barn']}>
                <VelgBarn />
            </TestProvidere>
        );
        const ident = screen.queryByText(søknad.søker.barn[0].ident ?? 'finnes-ikke-kast-feil');
        const info = screen.queryByText('VELG_BARN.registrertMedAdressesperre');

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

        render(
            <TestProvidere mocketNettleserHistorikk={['/velg-barn']}>
                <VelgBarn />
            </TestProvidere>
        );

        const fjernBarnKnapp = screen.getByRole('button', { name: 'FELLES.modaler.leggTilBarn.fjernKnapp' });
        act(() => fjernBarnKnapp.click());

        const leggTilBarnKnapp = screen.getByRole('button', { name: 'FELLES.modaler.leggTilBarn.leggTilKnapp' });
        act(() => leggTilBarnKnapp.click());

        const modal = within(screen.getByRole('dialog'));
        const leggTilKnappIModal = modal.getByRole('button', { name: 'FELLES.modaler.leggTilBarn.leggTilKnapp' });

        const erBarnetFødt = hentSpørsmål('FELLES.modaler.leggTilBarn.erBarnetFoedt.sporsmal');
        act(() => hentSvaralternativ(erBarnetFødt, 'ja').click());

        const fornavnInput = modal.getByLabelText('FELLES.modaler.leggTilBarn.fornavn.sporsmal');
        const etternavnInput = modal.getByLabelText('FELLES.modaler.leggTilBarn.etternavn.sporsmal');
        const idnrInput = modal.getByLabelText('FELLES.modaler.leggTilBarn.foedselsnummerEllerDNummer.sporsmal');

        act(() => {
            fireEvent.input(fornavnInput, { target: { value: manueltRegistrert.navn } });
            fireEvent.input(etternavnInput, { target: { value: 'whatever' } });
            fireEvent.input(idnrInput, { target: { value: manueltRegistrert.ident } });
        });

        await act(() => leggTilKnappIModal.click());

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

        render(
            <TestProvidere mocketNettleserHistorikk={['/velg-barn']}>
                <VelgBarn />
            </TestProvidere>
        );
        const checkbox = screen.getByRole('checkbox', { name: 'VELG_BARN.soekOmYtelseForBarnetSjekkboks Jens' });
        act(() => checkbox.click());

        expect(checkbox).toBeChecked();
    });
});
