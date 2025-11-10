import { act, fireEvent, render, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';

import { ESvar } from '@navikt/familie-form-elements';
import * as fnrvalidator from '@navikt/fnrvalidator';

import { TestProvidere, spyOnUseApp } from '../../../../utils/testing';

import LeggTilBarnModal from './LeggTilBarnModal';
import { NyttBarnKort } from './NyttBarnKort';

vi.mock('@navikt/fnrvalidator');

describe('NyttBarnKort', () => {
    test(`Kan legge til barn`, async () => {
        spyOnUseApp({ barnRegistrertManuelt: [], søker: { barn: [] } });

        vi.spyOn(fnrvalidator, 'idnr').mockReturnValue({ status: 'valid', type: 'fnr' });
        const åpen: number[] = [];

        const { getByRole, getByTestId, rerender } = render(
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

        const leggTilBarnKort = getByRole('button');
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

        const leggTilKnappIModal = getByTestId('submit-knapp-i-modal');
        expect(leggTilKnappIModal).toBeInTheDocument();
        expect(leggTilKnappIModal).toHaveClass('navds-button--secondary');

        const erFødt = getByTestId('legg-til-barn-er-født');
        expect(erFødt).toBeInTheDocument();

        const jaKnapp = within(erFødt)
            .getAllByRole('radio')
            .find(radio => radio.getAttribute('value') === ESvar.JA);
        expect(jaKnapp).toBeDefined();
        act(() => jaKnapp!.click());

        const fornavnInput = getByTestId('legg-til-barn-fornavn');
        const etternavnInput = getByTestId('legg-til-barn-etternavn');
        const idnrInput = getByTestId('legg-til-barn-fnr');

        act(() => {
            fireEvent.input(fornavnInput, { target: { value: 'Sirius' } });
            fireEvent.input(etternavnInput, { target: { value: 'Svaart' } });
            fireEvent.input(idnrInput, { target: { value: '031159123456' } });
        });

        expect(leggTilKnappIModal).toHaveClass('navds-button--primary');

        // Her skjer det async kall med axios, som vi må vente på i de neste expectene
        act(() => leggTilKnappIModal?.click());
        await waitFor(() => expect(åpen.length).toBe(0));
    });
});
