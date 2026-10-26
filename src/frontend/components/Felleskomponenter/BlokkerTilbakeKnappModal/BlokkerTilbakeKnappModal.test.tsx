import { ESvar } from '@navikt/familie-form-elements';
import { act, render, screen, within } from '@testing-library/react';
import { useNavigate } from 'react-router';

import { barnDataKeySpørsmål, type IBarnMedISøknad } from '../../../typer/barn';
import type { IBarn, IBarnRespons } from '../../../typer/person';
import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../../SøknadsSteg/OmBarnaDine/spørsmål';

import { BlokkerTilbakeKnappModal } from './BlokkerTilbakeKnappModal';

const manueltRegistrert: Partial<IBarn> = {
    ident: '12345',
    navn: 'A',
};
const fraPdl: Partial<IBarnRespons> = {
    ident: '54321',
    navn: 'B',
};

const manueltRegistrertSomIBarnMedISøknad: Partial<IBarnMedISøknad> = {
    ...manueltRegistrert,
    id: 'random-id-1',
    utenlandsperioder: [],
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
        id: OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland,
        svar: ESvar.NEI,
    },
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

describe('Ingen navigering tilbake til søknad fra kvitteringssiden', () => {
    test(`Render BlokkerTilbakeKnappModal og sjekk at den virker`, async () => {
        silenceConsoleErrors();
        const søknad = {
            barnRegistrertManuelt: [manueltRegistrert],
            barnInkludertISøknaden: [manueltRegistrertSomIBarnMedISøknad, fraPdlSomIBarnMedISøknad],
            søker: { barn: [fraPdl] },
            dokumentasjon: [],
            fåttGyldigKvittering: true,
        };
        const { settSøknad } = spyOnUseApp(søknad);

        settSøknad.mockImplementation(nySøknad => {
            søknad.barnRegistrertManuelt = nySøknad.barnRegistrertManuelt;
            søknad.barnInkludertISøknaden = nySøknad.barnInkludertISøknaden;
        });

        const Tilbakeknapp = () => {
            const navigate = useNavigate();

            return (
                <button type="button" onClick={() => navigate(-1)}>
                    Tilbake
                </button>
            );
        };

        render(
            <TestProvidere mocketNettleserHistorikk={['/dokumentasjon', '/kvittering']}>
                <BlokkerTilbakeKnappModal />
                <Tilbakeknapp />
            </TestProvidere>
        );

        const tilbakeknapp = await screen.findByRole('button', { name: 'Tilbake' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        act(() => {
            tilbakeknapp.click();
        });

        const modal = await screen.findByRole('dialog', { name: 'FELLES.modaler.blokkerTilbakeknapp.tittel' });

        expect(within(modal).getByText('FELLES.modaler.blokkerTilbakeknapp.tilDittNav')).toBeInTheDocument();
    });
});
