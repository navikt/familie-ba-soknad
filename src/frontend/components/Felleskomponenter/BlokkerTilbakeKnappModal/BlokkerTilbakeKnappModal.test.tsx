import React from 'react';

import { act, render, waitFor } from '@testing-library/react';
import { BrowserRouter, Route } from 'react-router-dom';

import { ISøknad } from '../../../typer/søknad';
import {
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
} from '../../../utils/testing';
import BlokkerTilbakeKnappModal from './BlokkerTilbakeKnappModal';

const manueltRegistrert = {
    ident: '12345',
    navn: 'A',
};
const fraPdl = {
    ident: '54321',
    navn: 'B',
};

describe('Ingen navigering tilbake til søknad fra kvitteringssiden', () => {
    test(`Render BlokkerTilbakeKnappModal og sjekk at den virker`, async () => {
        const { mockedHistory } = mockHistory(['dokumentasjon', 'kvittering']);
        silenceConsoleErrors();
        const søknad = {
            barnRegistrertManuelt: [manueltRegistrert],
            barnInkludertISøknaden: [manueltRegistrert, fraPdl],
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
