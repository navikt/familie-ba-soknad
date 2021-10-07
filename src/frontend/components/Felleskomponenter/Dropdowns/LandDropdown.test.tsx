import React from 'react';

import { render } from '@testing-library/react';
import { Alpha3Code } from 'i18n-iso-countries';
import { mockDeep } from 'jest-mock-extended';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import { mockEøs, TestProvidereMedEkteTekster } from '../../../utils/testing';
import { LandDropdown } from './LandDropdown';

describe('LandDropdown', () => {
    it('Rendrer alle land i alle dropdowns når eøs er skrudd av', () => {
        mockEøs(true);
        const felt = mockDeep<Felt<'' | Alpha3Code>>({
            erSynlig: true,
        });
        const skjema = mockDeep<ISkjema<SkjemaFeltTyper, string>>();

        const { getAllByRole, unmount } = render(
            <TestProvidereMedEkteTekster>
                <LandDropdown felt={felt} skjema={skjema} />
            </TestProvidereMedEkteTekster>
        );

        let options = getAllByRole('option');

        expect(options).toHaveLength(251);
        unmount();

        render(
            <TestProvidereMedEkteTekster>
                <LandDropdown felt={felt} skjema={skjema} kunEøs />
            </TestProvidereMedEkteTekster>
        );

        options = getAllByRole('option');

        expect(options).toHaveLength(251);
    });

    it('Rendrer kun EØS-land når EØS er på og kunEøs-prop er true', () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'AFG'].includes(landKode));

        const felt = mockDeep<Felt<'' | Alpha3Code>>({
            erSynlig: true,
        });
        const skjema = mockDeep<ISkjema<SkjemaFeltTyper, string>>();

        const { getAllByRole } = render(
            <TestProvidereMedEkteTekster>
                <LandDropdown felt={felt} skjema={skjema} kunEøs />
            </TestProvidereMedEkteTekster>
        );

        const options = getAllByRole('option');

        expect(options).toHaveLength(3);
    });
});
