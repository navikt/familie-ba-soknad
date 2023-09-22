import React from 'react';

import { act, render, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

import { ESvar } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/barn';
import { IBarn, IBarnRespons } from '../../../typer/person';
import { mockEøs, silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../../SøknadsSteg/OmBarnaDine/spørsmål';

import BlokkerTilbakeKnappModal from './BlokkerTilbakeKnappModal';

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
    beforeEach(() => {
        mockEøs();
    });
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
                <button data-testid="tilbakeknapp" onClick={() => navigate(-1)}>
                    Tilbake
                </button>
            );
        };

        const { getByText, findByTestId } = render(
            <TestProvidere mocketNettleserHistorikk={['/dokumentasjon', '/kvittering']}>
                <BlokkerTilbakeKnappModal />
                <Tilbakeknapp />
            </TestProvidere>
        );

        const tilbakeknapp = await findByTestId('tilbakeknapp');
        act(() => {
            tilbakeknapp.click();
        });

        const infoTekst = await waitFor(() => getByText(/felles.blokkerTilbakeKnapp.modal.tekst/));

        expect(infoTekst).toBeInTheDocument();
    });
});
