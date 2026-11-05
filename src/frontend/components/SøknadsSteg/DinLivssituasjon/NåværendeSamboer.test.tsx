import { ESvar } from '@navikt/familie-form-elements';
import { act, render, screen } from '@testing-library/react';
import { mockDeep } from 'vitest-mock-extended';

import { ESivilstand, ESøknadstype } from '../../../../common/typer/kontrakt/generelle';
import { AlternativtSvarForInput } from '../../../typer/svar';
import type { ISøknad } from '../../../typer/søknad';
import { spyOnUseApp, TestProvidereMedEkteTekster } from '../../../utils/testing';

import DinLivssituasjon from './DinLivssituasjon';
import { getAllNåværendeSamboerFields } from './NåværendeSamboerTestUtils';
import { DinLivssituasjonSpørsmålId, SamboerSpørsmålId } from './spørsmål';

const renderDinLivssituasjon = søknad => {
    const søknadMock = mockDeep<ISøknad>(søknad);
    spyOnUseApp(søknadMock);
    return render(
        <TestProvidereMedEkteTekster mocketNettleserHistorikk={['/din-livssituasjon']}>
            <DinLivssituasjon />
        </TestProvidereMedEkteTekster>
    );
};

const søknad = {
    søknadstype: ESøknadstype.UTVIDET,
    barnInkludertISøknaden: [
        {
            ident: '1234',
        },
    ],
    søker: {
        sivilstand: { type: ESivilstand.UGIFT },
        utvidet: {
            spørsmål: {
                harSamboerNå: {
                    id: DinLivssituasjonSpørsmålId.harSamboerNå,
                    svar: ESvar.JA,
                },
            },
            nåværendeSamboer: null,
            tidligereSamboere: [],
        },
    },
};

const søknadGyldigNåværendeSamboerBase = {
    ...søknad,
    søker: {
        ...søknad.søker,
        utvidet: {
            ...søknad.søker.utvidet,
            nåværendeSamboer: {
                navn: {
                    id: SamboerSpørsmålId.nåværendeSamboerNavn,
                    svar: 'Initial verdi for samboer sitt navn',
                },
                ident: {
                    id: SamboerSpørsmålId.nåværendeSamboerFnr,
                    svar: AlternativtSvarForInput.UKJENT,
                },
                fødselsdato: {
                    id: SamboerSpørsmålId.nåværendeSamboerFødselsdato,
                    svar: AlternativtSvarForInput.UKJENT,
                },
                samboerFraDato: {
                    id: SamboerSpørsmålId.nåværendeSamboerFraDato,
                    svar: '2000-01-01',
                },
            },
        },
    },
};

describe('Test av nåværende samboer skjema', () => {
    it('nåværende samboer null initiell verdi', () => {
        const { container } = renderDinLivssituasjon(søknad);
        const [navn, fnr, fnrUkjent, fødselsdato, fødselsdatoUkjent, samboerFraDato] =
            getAllNåværendeSamboerFields(container);

        expect(navn.value).toBe('');
        expect(fnr.value).toBe('');
        expect(fnrUkjent.checked).toBe(false);
        expect(fødselsdato).not.toBeInTheDocument();
        expect(fødselsdatoUkjent).not.toBeInTheDocument();
        expect(samboerFraDato.value).toBe('');
    });

    it('har alle felter riktig og validert ved gyldig nåværende samboer som initiell verdi fra Søknad.', async () => {
        await act(async () => {
            renderDinLivssituasjon(søknadGyldigNåværendeSamboerBase);
        });

        const container: HTMLElement = document.body;

        const [navn, fnr, fnrUkjent, fødselsdato, fødselsdatoUkjent, samboerFraDato] =
            getAllNåværendeSamboerFields(container);
        const gåVidere = screen.getByRole('button', { name: 'FELLES.navigasjon.gaaVidereKnapp' });

        expect(navn.value).toBe('Initial verdi for samboer sitt navn');
        expect(fnr.value).toBe('');
        expect(fnr.disabled).toBe(true);
        expect(fnrUkjent.checked).toBe(true);
        expect(fødselsdato.value).toBe('');
        expect(fødselsdato.disabled).toBe(true);
        expect(fødselsdatoUkjent.checked).toBe(true);
        expect(samboerFraDato.value).toBe('01.01.2000');

        act(() => {
            fnrUkjent.click();
        });

        expect(fnr.disabled).toBe(false);
        expect(fødselsdato).not.toBeInTheDocument();
        expect(fødselsdatoUkjent).not.toBeInTheDocument();

        act(() => gåVidere.click());

        expect(screen.getByRole('heading', { name: 'FELLES.navigasjon.duMaaRetteOppFoelgende' })).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'DIN_LIVSSITUASJON.foedselsEllerDNummer.feilmelding' })
        ).toBeInTheDocument();
        expect(fnr).toHaveAttribute('aria-invalid', 'true');
    });
});
