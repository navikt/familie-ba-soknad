import React from 'react';

import { act, render, waitFor } from '@testing-library/react';
import { BrowserRouter, Route } from 'react-router-dom';

import { ESvar } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål, IBarn, IBarnRespons } from '../../../typer/person';
import { IBarnMedISøknad } from '../../../typer/søknad';
import * as eøsUtils from '../../../utils/eøs';
import {
    mockEøs,
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
} from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../../SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../../SøknadsSteg/OmBarnet/spørsmål';
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
    barnetrygdFraEøslandHvilketLand: {
        id: OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand,
        svar: 'NOR',
    },
    utenlandsperioder: [],
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
        id: OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland,
        svar: ESvar.NEI,
    },
};

const fraPdlSomIBarnMedISøknad: Partial<IBarnMedISøknad> = {
    ...fraPdl,
    id: 'random-id-2',
    barnetrygdFraEøslandHvilketLand: {
        id: OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand,
        svar: 'NOR',
    },
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
        jest.spyOn(eøsUtils, 'landSvarSomKanTriggeEøs').mockReturnValue([]);
        const { mockedHistory } = mockHistory(['dokumentasjon', 'kvittering']);
        silenceConsoleErrors();
        const søknad = {
            barnRegistrertManuelt: [manueltRegistrert],
            barnInkludertISøknaden: [manueltRegistrertSomIBarnMedISøknad, fraPdlSomIBarnMedISøknad],
            søker: { barn: [fraPdl] },
            dokumentasjon: [],
        };
        const { settSøknad } = spyOnUseApp(søknad);

        settSøknad.mockImplementation(nySøknad => {
            søknad.barnRegistrertManuelt = nySøknad.barnRegistrertManuelt;
            søknad.barnInkludertISøknaden = nySøknad.barnInkludertISøknaden;
        });

        const { getByText } = render(
            <TestProvidere>
                <BrowserRouter>
                    <Route path={'*'} component={BlokkerTilbakeKnappModal} />
                </BrowserRouter>
            </TestProvidere>
        );

        act(() => {
            mockedHistory.goBack();
        });

        const infoTekst = await waitFor(() => getByText(/felles.blokkerTilbakeKnapp.modal.tekst/));

        expect(infoTekst).toBeInTheDocument();
    });
});
