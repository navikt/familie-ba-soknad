import React from 'react';

import { act, fireEvent, render, waitFor } from '@testing-library/react';

import * as fnrvalidator from '@navikt/fnrvalidator';

import {
    silenceConsoleErrors,
    mockFeatureToggle,
    TestProvidere,
    spyOnUseApp,
} from '../../../../utils/testing';

import LeggTilBarnModal from './LeggTilBarnModal';
import { NyttBarnKort } from './NyttBarnKort';

jest.mock('@navikt/fnrvalidator');

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: 'localhost:3000/velg-barn/',
    }),
}));

describe('NyttBarnKort', () => {
    test(`Kan legge til barn`, async () => {
        silenceConsoleErrors();
        mockFeatureToggle();
        spyOnUseApp({ barnRegistrertManuelt: [], søker: { barn: [] } });

        jest.spyOn(fnrvalidator, 'idnr').mockReturnValue({ status: 'valid', type: 'fnr' });
        const åpen: number[] = [];

        const { getByRole, getByText, getByTestId, rerender } = render(
            <TestProvidere>
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

        const leggTilKnappIModal = getByTestId('hvilkebarn.leggtilbarn.kort.knapp');
        expect(leggTilKnappIModal).toBeInTheDocument();
        expect(leggTilKnappIModal).toHaveClass('navds-button--secondary');

        const erFødt = getByText('hvilkebarn.leggtilbarn.barnfødt.spm');
        expect(erFødt).toBeInTheDocument();

        // Språktekst-id for Ja er 'ja'
        const jaKnapp = getByText('felles.svaralternativ.ja');
        act(() => jaKnapp.click());

        const fornavnLabel = getByText('hvilkebarn.leggtilbarn.fornavn.spm');
        const etternavnLabel = getByText('hvilkebarn.leggtilbarn.etternavn.spm');
        const idnrLabel = getByText('felles.fødsels-eller-dnummer.label');
        expect(fornavnLabel).toBeInTheDocument();
        expect(etternavnLabel).toBeInTheDocument();
        expect(idnrLabel).toBeInTheDocument();
        const fornavnInput = fornavnLabel.nextElementSibling || new Element();
        const etternavnInput = etternavnLabel.nextElementSibling || new Element();
        const idnrInput = idnrLabel.nextElementSibling || new Element();

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
