import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { hentSpørsmål, hentSvaralternativ, silenceConsoleErrors, spyOnUseApp, TestProvidere } from '@utils/testing';
import { vi } from 'vitest';

import LeggTilBarnModal from './LeggTilBarnModal';

describe('LeggTilBarnModal', () => {
    test('Godtar fødselsnummer med mellomrom og lagrer det uten mellomrom', async () => {
        const { settSøknad } = spyOnUseApp({ barnRegistrertManuelt: [], søker: { barn: [] } });
        const lukkModal = vi.fn();

        render(
            <TestProvidere>
                <LeggTilBarnModal erÅpen={true} lukkModal={lukkModal} />
            </TestProvidere>
        );

        const modal = within(screen.getByRole('dialog'));
        const erFødtSpørsmål = hentSpørsmål('FELLES.modaler.leggTilBarn.erBarnetFoedt.sporsmal');

        act(() => hentSvaralternativ(erFødtSpørsmål, 'ja').click());
        act(() => {
            fireEvent.input(modal.getByLabelText('FELLES.modaler.leggTilBarn.fornavn.sporsmal'), {
                target: { value: 'Sirius' },
            });
            fireEvent.input(modal.getByLabelText('FELLES.modaler.leggTilBarn.etternavn.sporsmal'), {
                target: { value: 'Svaart' },
            });
            fireEvent.input(modal.getByLabelText('FELLES.modaler.leggTilBarn.foedselsnummerEllerDNummer.sporsmal'), {
                target: { value: ' 010120 10059 ' },
            });
        });

        act(() => modal.getByRole('button', { name: 'FELLES.modaler.leggTilBarn.leggTilKnapp' }).click());

        await waitFor(() => expect(lukkModal).toHaveBeenCalled());
        expect(settSøknad).toHaveBeenCalledWith(
            expect.objectContaining({
                barnRegistrertManuelt: [expect.objectContaining({ ident: '01012010059' })],
            })
        );
    });

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
