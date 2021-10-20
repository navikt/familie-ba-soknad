import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { AlternativtSvarForInput } from '../../../typer/person';
import { ISøknad } from '../../../typer/søknad';
import {
    mekkGyldigSøknad,
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import { SamboerSpørsmålId } from '../DinLivssituasjon/spørsmål';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { OmDegSpørsmålId } from '../OmDeg/spørsmål';
import Oppsummering from './Oppsummering';

describe('Oppsummering', () => {
    beforeEach(silenceConsoleErrors);

    it('Alle tekster finnes i språkfil', () => {
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
            erAvdødPartnerForelder: {
                id: OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder,
                svar: null,
            },
            søker: {
                statsborgerskap: [{ landkode: 'NOR' }],
                oppholderSegINorge: { id: OmDegSpørsmålId.oppholderSegINorge, svar: null },
                nåværendeSamboer: {
                    navn: {
                        id: SamboerSpørsmålId.nåværendeSamboerNavn,
                        svar: 'Initial verdi for samboer sitt navn',
                    },
                    ident: {
                        id: SamboerSpørsmålId.nåværendeSamboerFnr,
                        svar: AlternativtSvarForInput.UKJENT,
                    },
                    fødselsdato: {
                        id: SamboerSpørsmålId.nåværendeSamboerFødselsdato,
                        svar: AlternativtSvarForInput.UKJENT,
                    },
                    samboerFraDato: {
                        id: SamboerSpørsmålId.nåværendeSamboerFraDato,
                        svar: '01.01.2000',
                    },
                },
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
