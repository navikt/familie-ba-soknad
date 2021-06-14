import React from 'react';

import { act, render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ISøknad } from '../../../typer/søknad';
import {
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
} from '../../../utils/testing';
import BlokkerTilbakeKnappModal from './BlokkerTilbakeKnappModal';

jest.mock('@navikt/fnrvalidator');

jest.mock('react-router-dom');

const manueltRegistrert = {
    ident: '12345',
    navn: 'A',
};
const fraPdl = {
    ident: '54321',
    navn: 'B',
};

describe('Ingen navigering tilbake til søknad fra kvitteringssiden', () => {
    test(`Render BlokkerTilbakeKnappModal og sjekk at den virker`, () => {
        const history = mockHistory(['dokumentasjon', 'kvittering']);

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

        const { queryByText, getByText } = render(
            <TestProvidere>
                <Router>
                    <div>
                        <BlokkerTilbakeKnappModal />
                    </div>
                </Router>
            </TestProvidere>
        );

        act(() => {
            history.pop();
        });

        console.warn(JSON.stringify(history, null, 4));

        const infoTekst = queryByText(/felles.blokkerTilbakeKnapp.modal.tekst/);

        getByText('baretullogtoys');

        expect(infoTekst).toBeInTheDocument();
    });
});
