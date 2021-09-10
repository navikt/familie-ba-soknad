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
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import Oppsummering from './Oppsummering';

describe('Oppsummering', () => {
    it('Alle tekster finnes i språkfil', () => {
        silenceConsoleErrors();
        mockHistory(['/oppsummering']);
        spyOnUseApp(mekkGyldigSøknad());

        render(
            <TestProvidereMedEkteTekster>
                <Oppsummering />
            </TestProvidereMedEkteTekster>
        );
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('stopper fra å gå videre hvis søknaden har mangler', () => {
        const søknad = mockDeep<ISøknad>({
            søker: {
                statsborgerskap: [{ landkode: 'NOR' }],
            },
            barnInkludertISøknaden: [
                {
                    ident: '1234',
                    institusjonsnavn: { svar: '' },
                    institusjonsadresse: { svar: '' },
                    andreForelderNavn: { svar: '' },
                    andreForelderFnr: { svar: '' },
                },
            ],
        });
        spyOnUseApp(søknad);
        const { mockedHistoryArray } = mockHistory(['/oppsummering']);

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
