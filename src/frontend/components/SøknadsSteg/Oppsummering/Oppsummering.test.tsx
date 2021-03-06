import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ISøknad } from '../../../typer/søknad';
import {
    mekkGyldigSøknad,
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
} from '../../../utils/testing';
import Oppsummering from './Oppsummering';

describe('Oppsummering', () => {
    it('stopper fra å gå videre hvis søknaden har mangler', () => {
        const søknad = mockDeep<ISøknad>({
            søker: {
                statsborgerskap: [{ landkode: 'NOR' }],
            },
            barnInkludertISøknaden: [
                {
                    ident: '1234',
                },
            ],
        });
        spyOnUseApp(søknad);
        const { mockedHistoryArray } = mockHistory(['/oppsummering']);

        silenceConsoleErrors();

        const { getByText, getAllByRole } = render(
            <TestProvidere>
                <Oppsummering />
            </TestProvidere>
        );
        const gåVidere = getByText('felles.navigasjon.gå-videre');

        act(() => gåVidere.click());

        const omDegFeil = getAllByRole('alert')[0];

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual({ hash: 'omdeg-feil' });
        expect(omDegFeil).toBeInTheDocument();
        expect(omDegFeil).toBeVisible();
    });

    it('går til dokumentasjon med gyldig søknad', () => {
        const søknad = mekkGyldigSøknad();
        spyOnUseApp(søknad);
        const { mockedHistoryArray } = mockHistory(['/oppsummering']);

        silenceConsoleErrors();

        const { getByText, queryAllByRole } = render(
            <TestProvidere>
                <Oppsummering />
            </TestProvidere>
        );
        const gåVidere = getByText('felles.navigasjon.gå-videre');

        act(() => gåVidere.click());

        expect(queryAllByRole('alert').length).toBe(0);
        waitFor(() =>
            expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/dokumentasjon')
        );
    });
});
