import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ESvar } from '@navikt/familie-form-elements';

import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import {
    LesUtLocation,
    mekkGyldigSøknad,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
} from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../OmBarnet/spørsmål';
import { OmDegSpørsmålId } from '../OmDeg/spørsmål';

import Oppsummering from './Oppsummering';

describe('Oppsummering', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });

    it('stopper fra å gå videre hvis søknaden har mangler', async () => {
        const søknad = mockDeep<ISøknad>({
            erAvdødPartnerForelder: {
                id: OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder,
                svar: null,
            },
            søker: {
                statsborgerskap: [{ landkode: 'NOR' }],
                værtINorgeITolvMåneder: { id: OmDegSpørsmålId.værtINorgeITolvMåneder, svar: null },
            },
            barnInkludertISøknaden: [
                {
                    ident: '1234',
                    institusjonsnavn: { id: OmBarnetSpørsmålsId.institusjonsnavn, svar: '' },
                    institusjonsadresse: { id: OmBarnetSpørsmålsId.institusjonsadresse, svar: '' },
                    erFosterbarn: { id: OmBarnaDineSpørsmålId.hvemErFosterbarn, svar: ESvar.JA },
                    andreForelder: null,
                    utenlandsperioder: [],
                    triggetEøs: false,
                },
            ],
            søknadstype: ESøknadstype.ORDINÆR,
        });
        spyOnUseApp(søknad);

        const { getByText, findByTestId } = render(
            <TestProvidere mocketNettleserHistorikk={['/oppsummering']}>
                <Oppsummering />
                <LesUtLocation />
            </TestProvidere>
        );
        const gåVidere = await findByTestId('neste-steg');
        await act(() => gåVidere.click());

        const feilmelding = getByText('omdeg.oppholdtsammenhengende.feilmelding');

        const location = await findByTestId('location');
        expect(JSON.parse(location.innerHTML).hash).toEqual('#omdeg-feil');

        expect(feilmelding).toBeInTheDocument();
    }, 10000);

    it('går til dokumentasjon med gyldig søknad', async () => {
        const søknad = mekkGyldigSøknad();
        spyOnUseApp(søknad);

        const { queryAllByRole, findByTestId } = render(
            <TestProvidere mocketNettleserHistorikk={['/oppsummering']}>
                <Oppsummering />
                <LesUtLocation />
            </TestProvidere>
        );
        const gåVidere = await findByTestId('neste-steg');

        await act(() => gåVidere.click());

        expect(queryAllByRole('alert').length).toBe(0);
        const location = await findByTestId('location');
        await waitFor(() => {
            expect(JSON.parse(location.innerHTML).pathname).toEqual('/dokumentasjon');
        });
    });
});
