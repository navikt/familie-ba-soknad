import React from 'react';

import { render } from '@testing-library/react';
import { DeepPartial } from 'ts-essentials';

import { SprakProvider } from '@navikt/familie-sprakvelger';

import App from './App';
import norskeTekster from './assets/lang/nb.json';
import { ISøknad } from './typer/søknad';
import { mockEøs, spyOnUseApp, wrapMedProvidere } from './utils/testing';

it('renders without crashing', async () => {
    const søknad: DeepPartial<ISøknad> = {};
    spyOnUseApp(søknad);
    mockEøs(false);
    const { findAllByText, unmount } = render(
        wrapMedProvidere([SprakProvider], <App />, norskeTekster)
    );
    await findAllByText(/Denne siden er under utvikling/);
    unmount();
});
