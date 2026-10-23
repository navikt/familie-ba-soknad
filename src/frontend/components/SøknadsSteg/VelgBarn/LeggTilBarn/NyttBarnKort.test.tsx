import * as fnrvalidator from '@navikt/fnrvalidator';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';

import { hentSpørsmål, hentSvaralternativ, spyOnUseApp, TestProvidere } from '../../../../utils/testing';

import LeggTilBarnModal from './LeggTilBarnModal';
import { NyttBarnKort } from './NyttBarnKort';

vi.mock('@navikt/fnrvalidator');

describe('NyttBarnKort', () => {
    test(`Kan legge til barn`, async () => {
        spyOnUseApp({ barnRegistrertManuelt: [], søker: { barn: [] } });

        vi.spyOn(fnrvalidator, 'idnr').mockReturnValue({ status: 'valid', type: 'fnr' });
        const åpen: number[] = [];

        const { rerender } = render(
            <TestProvidere mocketNettleserHistorikk={['localhost:3000/velg-barn/']}>
                <NyttBarnKort
                    onLeggTilBarn={() => {
                        åpen.push(1);
                    }}
                />
                {åpen.length && (
                    <LeggTilBarnModal
                        erÅpen={åpen.length > 0}
                        lukkModal={() => {
                            åpen.pop();
                        }}
                    />
                )}
            </TestProvidere>
        );

        const leggTilBarnKort = screen.getByRole('button', { name: 'FELLES.modaler.leggTilBarn.leggTilKnapp' });
        expect(leggTilBarnKort).toBeInTheDocument();
        act(() => leggTilBarnKort.click());

        rerender(
            <TestProvidere>
                <NyttBarnKort
                    onLeggTilBarn={() => {
                        åpen.push(1);
                    }}
                />
                {åpen.length > 0 && (
                    <LeggTilBarnModal
                        erÅpen={åpen.length > 0}
                        lukkModal={() => {
                            åpen.pop();
                        }}
                    />
                )}
            </TestProvidere>
        );

        const modal = within(screen.getByRole('dialog'));
        const leggTilKnappIModal = modal.getByRole('button', { name: 'FELLES.modaler.leggTilBarn.leggTilKnapp' });
        expect(leggTilKnappIModal).toBeInTheDocument();
        expect(leggTilKnappIModal).toHaveClass('aksel-button--medium');

        const erFødt = hentSpørsmål('FELLES.modaler.leggTilBarn.erBarnetFoedt.sporsmal');
        act(() => hentSvaralternativ(erFødt, 'ja').click());

        const fornavnInput = modal.getByLabelText('FELLES.modaler.leggTilBarn.fornavn.sporsmal');
        const etternavnInput = modal.getByLabelText('FELLES.modaler.leggTilBarn.etternavn.sporsmal');
        const idnrInput = modal.getByLabelText('FELLES.modaler.leggTilBarn.foedselsnummerEllerDNummer.sporsmal');

        act(() => {
            fireEvent.input(fornavnInput, { target: { value: 'Sirius' } });
            fireEvent.input(etternavnInput, { target: { value: 'Svaart' } });
            fireEvent.input(idnrInput, { target: { value: '031159123456' } });
        });

        expect(leggTilKnappIModal).toHaveClass('aksel-button--medium');

        // Her skjer det async kall med axios, som vi må vente på i de neste expectene
        act(() => leggTilKnappIModal.click());
        await waitFor(() => expect(åpen.length).toBe(0));
    });
});
