import React from 'react';

import { render } from '@testing-library/react';
import { vi } from 'vitest';

import * as hjelpefunksjoner from '../../../utils/hjelpefunksjoner';
import { TestProvidereMedEkteTekster } from '../../../utils/testing';

import { TilfeldigBarnIkon } from './TilfeldigBarnIkon';

describe('TilfeldigBarnIkon', () => {
    it('velger nytt ikon ved rerender by default', () => {
        const spy = vi.spyOn(hjelpefunksjoner, 'randomIntFraIntervall');
        const { rerender } = render(
            <TestProvidereMedEkteTekster>
                <TilfeldigBarnIkon />
            </TestProvidereMedEkteTekster>
        );

        // 2 ved første render, 1 for initiell useState, som ignoreres videre
        expect(spy.mock.calls.length).toEqual(2);

        rerender(
            <TestProvidereMedEkteTekster>
                <TilfeldigBarnIkon />
            </TestProvidereMedEkteTekster>
        );
        expect(spy.mock.calls.length).toEqual(3);

        rerender(
            <TestProvidereMedEkteTekster>
                <TilfeldigBarnIkon />
            </TestProvidereMedEkteTekster>
        );
        expect(spy.mock.calls.length).toEqual(4);
    });

    it('kan låse barnikon mellom rerenders med prop', () => {
        const spy = vi.spyOn(hjelpefunksjoner, 'randomIntFraIntervall');

        const { rerender } = render(
            <TestProvidereMedEkteTekster>
                <TilfeldigBarnIkon byttVedRerender={false} />
            </TestProvidereMedEkteTekster>
        );
        expect(spy.mock.calls.length).toEqual(1);

        rerender(
            <TestProvidereMedEkteTekster>
                <TilfeldigBarnIkon byttVedRerender={false} />
            </TestProvidereMedEkteTekster>
        );
        expect(spy.mock.calls.length).toEqual(1);
    });
});
