import React from 'react';

import { act, render, within } from '@testing-library/react';
import { vi } from 'vitest';

import { ESvar } from '@navikt/familie-form-elements';

import { silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../../utils/testing';

import LeggTilBarnModal from './LeggTilBarnModal';

describe('LeggTilBarnModal', () => {
    test('Test at advarsel om fnr vises hvis man huker av for at barnet ikke har fått fnr enda', () => {
        silenceConsoleErrors();
        spyOnUseApp({});

        const { getByTestId } = render(
            <TestProvidere>
                <LeggTilBarnModal erÅpen={true} lukkModal={vi.fn()} />
            </TestProvidere>
        );

        const erFødtSpørsmål = getByTestId('legg-til-barn-er-født');

        const erFødtJaKnapp = within(erFødtSpørsmål)
            .getAllByRole('radio')
            .find(radio => radio.getAttribute('value') === ESvar.JA);
        expect(erFødtJaKnapp).toBeDefined();
        act(() => erFødtJaKnapp!.click());

        const fødselsnummerEllerDNummerContainer = getByTestId('fødselsnummer-eller-d-nummer-container');

        const harIkkFnrCheckbox = within(fødselsnummerEllerDNummerContainer).getByRole('checkbox');
        act(() => harIkkFnrCheckbox.click());

        const advarsel = getByTestId('søker-må-bruke-pdf');
        expect(advarsel).toBeInTheDocument();
    });
});
