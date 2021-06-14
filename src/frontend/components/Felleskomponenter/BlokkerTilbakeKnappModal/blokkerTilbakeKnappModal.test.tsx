import React from 'react';

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { mockHistory, TestProvidereMedEkteTekster } from '../../../utils/testing';
import BlokkerTilbakeKnappModal from './BlokkerTilbakeKnappModal';

mockHistory(['/dokumentasjon', '/kvittering']);

describe('Ingen navigering tilbake til søknad fra kvitteringssiden', () => {
    test(`Render BlokkerTilbakeKnappModal og sjekk at den virker`, () => {
        render(
            <TestProvidereMedEkteTekster>
                <BlokkerTilbakeKnappModal />
            </TestProvidereMedEkteTekster>,
            { wrapper: BrowserRouter }
        );

        // Er på kvittering side
        // Trykker tilbake knappen (goBack() eller pop())
        // Er fortsatt på kvitteringsside og kan se modalen.
    });
});
