import { act } from 'react';

import { render, waitFor } from '@testing-library/react';
import { mockDeep } from 'vitest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import { ESøknadstype } from '../../../../common/typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import { LesUtLocation, mekkGyldigSøknad, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../OmBarnet/spørsmål';
import { OmDegSpørsmålId } from '../OmDeg/spørsmål';

import Oppsummering from './Oppsummering';

describe('Oppsummering', () => {
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

        const { container, findByTestId } = render(
            <TestProvidere mocketNettleserHistorikk={['/oppsummering']}>
                <Oppsummering />
                <LesUtLocation />
            </TestProvidere>
        );
        const gåVidere = await findByTestId('neste-steg');
        await act(() => gåVidere.click());

        const feilOppsummering = container.getElementsByClassName('navds-error-summary')[0];

        const location = await findByTestId('location');
        expect(JSON.parse(location.innerHTML).hash).toEqual('#omdeg-feil');

        expect(feilOppsummering).toBeInTheDocument();
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
