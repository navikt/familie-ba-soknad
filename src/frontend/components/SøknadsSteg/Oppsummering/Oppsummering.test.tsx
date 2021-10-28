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
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { OmDegSpørsmålId } from '../OmDeg/spørsmål';
import Oppsummering from './Oppsummering';

describe('Oppsummering', () => {
    beforeEach(silenceConsoleErrors);

    it('Alle tekster finnes i språkfil', async () => {
        mockHistory(['/oppsummering']);
        spyOnUseApp(mekkGyldigSøknad());

        const { findAllByRole } = render(
            <TestProvidereMedEkteTekster>
                <Oppsummering />
            </TestProvidereMedEkteTekster>
        );
        await findAllByRole('button');

        expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('stopper fra å gå videre hvis søknaden har mangler', async () => {
        const søknad = mockDeep<ISøknad>({
            erAvdødPartnerForelder: {
                id: OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder,
                svar: null,
            },
            søker: {
                statsborgerskap: [{ landkode: 'NOR' }],
                oppholderSegINorge: { id: OmDegSpørsmålId.oppholderSegINorge, svar: null },
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

        const { findByText, getAllByRole } = render(
            <TestProvidere>
                <Oppsummering />
            </TestProvidere>
        );
        const gåVidere = await findByText('felles.navigasjon.gå-videre');

        act(() => gåVidere.click());

        const omDegFeil = getAllByRole('alert')[0];

        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual({ hash: 'omdeg-feil' });
        expect(omDegFeil).toBeInTheDocument();
        expect(omDegFeil).toBeVisible();
    }, 10000);

    it('går til dokumentasjon med gyldig søknad', async () => {
        const søknad = mekkGyldigSøknad();
        spyOnUseApp(søknad);
        const { mockedHistoryArray } = mockHistory(['/oppsummering']);

        const { findByText, queryAllByRole } = render(
            <TestProvidere>
                <Oppsummering />
            </TestProvidere>
        );
        const gåVidere = await findByText('felles.navigasjon.gå-videre');

        act(() => gåVidere.click());

        expect(queryAllByRole('alert').length).toBe(0);
        waitFor(() =>
            expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/dokumentasjon')
        );
    });
});
