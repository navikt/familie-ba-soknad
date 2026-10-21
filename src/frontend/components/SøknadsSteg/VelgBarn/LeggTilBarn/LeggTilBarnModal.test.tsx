import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import {
    hentSpørsmål,
    hentSvaralternativ,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
} from '../../../../utils/testing';

import LeggTilBarnModal from './LeggTilBarnModal';

describe('LeggTilBarnModal', () => {
    test('Test at advarsel om fnr vises hvis man huker av for at barnet ikke har fått fnr enda', () => {
        silenceConsoleErrors();
        spyOnUseApp({});

        render(
            <TestProvidere>
                <LeggTilBarnModal erÅpen={true} lukkModal={vi.fn()} />
            </TestProvidere>
        );

        const erFødtSpørsmål = hentSpørsmål('FELLES.modaler.leggTilBarn.erBarnetFoedt.sporsmal');
        act(() => hentSvaralternativ(erFødtSpørsmål, 'ja').click());

        expect(screen.queryByText('FELLES.modaler.leggTilBarn.foedselsnummerAlert')).not.toBeInTheDocument();

        const harIkkeFnrCheckbox = screen.getByRole('checkbox', {
            name: 'FELLES.modaler.leggTilBarn.foedselsnummerEllerDNummer.checkboxLabel',
        });
        act(() => harIkkeFnrCheckbox.click());

        expect(screen.getByText('FELLES.modaler.leggTilBarn.foedselsnummerAlert')).toBeInTheDocument();
    });
});
