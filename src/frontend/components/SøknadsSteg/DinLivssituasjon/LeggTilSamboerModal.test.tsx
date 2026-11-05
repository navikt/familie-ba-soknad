import { render, screen, within } from '@testing-library/react';
import { act } from 'react';
import { mockDeep } from 'vitest-mock-extended';

import { ESøknadstype } from '../../../../common/typer/kontrakt/generelle';
import type { ISøknad } from '../../../typer/søknad';
import { hentSvaralternativ, spyOnUseApp, TestProvidere, ventPåSpørsmål } from '../../../utils/testing';

import DinLivssituasjon from './DinLivssituasjon';
import { DinLivssituasjonSpørsmålId } from './spørsmål';

const søknad = mockDeep<ISøknad>({
    søknadstype: ESøknadstype.UTVIDET,
    barnInkludertISøknaden: [
        {
            ident: '1234',
        },
    ],
    søker: {
        utvidet: {
            spørsmål: {
                harSamboerNå: {
                    id: DinLivssituasjonSpørsmålId.harSamboerNå,
                    svar: null,
                },
                hattAnnenSamboerForSøktPeriode: {
                    id: DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode,
                    svar: null,
                },
            },
            nåværendeSamboer: null,
            tidligereSamboere: [],
        },
    },
});

describe('LeggTilSamboerModal', () => {
    it('Viser riktige feilmeldinger ved ingen utfylte felt av tidligere samboer', async () => {
        spyOnUseApp(søknad);

        render(
            <TestProvidere mocketNettleserHistorikk={['/din-livssituasjon']}>
                <DinLivssituasjon />
            </TestProvidere>
        );

        const hattAnnenSamboerSpørsmål = await ventPåSpørsmål(
            'DIN_LIVSSITUASJON.hattAnnenSamboerForSoektPeriode.sporsmal'
        );
        act(() => hentSvaralternativ(hattAnnenSamboerSpørsmål, 'ja').click());

        const leggTilSamboerKnapp = screen.getByRole('button', {
            name: 'FELLES.modaler.tidligereSamboere.søker.leggTilKnapp',
        });
        act(() => leggTilSamboerKnapp.click());

        const modal = within(screen.getByRole('dialog'));
        const leggTilKnappIModal = modal.getByRole('button', {
            name: 'FELLES.modaler.tidligereSamboere.søker.leggTilKnapp',
        });
        act(() => leggTilKnappIModal.click());

        expect(modal.getByRole('heading', { name: 'FELLES.navigasjon.duMaaRetteOppFoelgende' })).toBeInTheDocument();
        expect(modal.getAllByRole('link').map(lenke => lenke.textContent)).toEqual([
            'FELLES.modaler.tidligereSamboere.søker.samboerNavn.feilmelding',
            'FELLES.modaler.tidligereSamboere.søker.foedselsnummerEllerDNummer.feilmelding',
            'FELLES.modaler.tidligereSamboere.søker.startdato.feilmelding',
            'FELLES.modaler.tidligereSamboere.søker.sluttdato.feilmelding',
        ]);
    });
});
