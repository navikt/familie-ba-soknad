import { ESvar } from '@navikt/familie-form-elements';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { ESivilstand, ESøknadstype, Slektsforhold } from '../../common/typer/kontrakt/generelle';
import { useDinLivssituasjon } from '../components/SøknadsSteg/DinLivssituasjon/useDinLivssituasjon';
import EøsForBarn from '../components/SøknadsSteg/EøsSteg/Barn/EøsForBarn';
import EøsForSøker from '../components/SøknadsSteg/EøsSteg/Søker/EøsForSøker';
import { useOmBarnaDine } from '../components/SøknadsSteg/OmBarnaDine/useOmBarnaDine';
import { useOmBarnet } from '../components/SøknadsSteg/OmBarnet/useOmBarnet';
import { useOmdeg } from '../components/SøknadsSteg/OmDeg/useOmdeg';
import Oppsummering from '../components/SøknadsSteg/Oppsummering/Oppsummering';
import { useVelgBarn } from '../components/SøknadsSteg/VelgBarn/useVelgBarn';
import { useSendInnSkjema } from '../hooks/useSendInnSkjema';
import { LesUtLocation, silenceConsoleErrors, TestProvidere, TestProvidereForSanity } from '../utils/testing';

import { byggPreutfyltSøknad, finnUgyldigKombinasjon } from './byggPreutfyltSøknad';
import { Avvik, Scenario } from './scenario';
import {
    BARN,
    brukSøknad,
    EKSTRA_BARN_IDENT,
    EØS_LAND,
    erEøs,
    preutfyll,
    TILFELLER,
    TILFELLER_MED_KOMBINASJONER,
    TILFELLER_MED_SIVILSTAND,
    type Tilfelle,
} from './testoppsett';

const GÅ_VIDERE = 'FELLES.navigasjon.gaaVidereKnapp';
const FEILOPPSUMMERING = 'FELLES.navigasjon.duMaaRetteOppFoelgende';
const EØS_TILFELLER = TILFELLER.filter(erEøs);

// Vises når en test feiler, slik at den som har endret søknaden ser hva testen vil og hva valgene er.
const STEGET_LAGRER_NOE_ANNET =
    'Steget i søknaden lagrer noe annet enn testverktøyet for preutfylling har skrevet. Oppdater ' +
    'byggPreutfyltSøknad.ts, eller slett verktøyet hvis ingen bruker det. Se src/frontend/preutfylling/README.md.';
const SØKNADEN_GODTAS_IKKE =
    'Søknaden godtar ikke lenger det testverktøyet for preutfylling skriver. Oppdater byggPreutfyltSøknad.ts, ' +
    'eller slett verktøyet hvis ingen bruker det. Se src/frontend/preutfylling/README.md.';

/**
 * Stegene i søknaden eier reglene for hvilke spørsmål som vises og hva som lagres. Testene under lar hvert steg lagre
 * den preutfylte søknaden på nytt, og krever at ingenting endrer seg. Da har verktøyet skrevet akkurat det søknaden selv
 * ville lagret for de samme svarene, også vedleggskrav og svar som skal være tomme fordi spørsmålet er skjult.
 *
 * Feiler en test her etter en endring i søknaden, se README.md i denne mappen.
 */
describe('Stegene i søknaden lagrer det samme som verktøyet har skrevet', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });

    const lagretAvSteget = (brukSteget: () => { oppdaterSøknad: () => void }, tilfelle: Tilfelle) => {
        const preutfylt = preutfyll(tilfelle);
        const { settSøknad } = brukSøknad(structuredClone(preutfylt));
        const { result } = renderHook(brukSteget, { wrapper: TestProvidere });
        settSøknad.mockClear();

        act(() => result.current.oppdaterSøknad());

        expect(settSøknad).toHaveBeenCalledTimes(1);
        return { lagret: settSøknad.mock.calls[0][0], preutfylt };
    };

    it.each(TILFELLER)('Om deg: $navn', tilfelle => {
        const { lagret, preutfylt } = lagretAvSteget(() => useOmdeg(), tilfelle);

        expect(lagret, STEGET_LAGRER_NOE_ANNET).toEqual(preutfylt);
    });

    it.each(TILFELLER)('Din livssituasjon: $navn', tilfelle => {
        const { lagret, preutfylt } = lagretAvSteget(() => useDinLivssituasjon(), tilfelle);

        expect(lagret, STEGET_LAGRER_NOE_ANNET).toEqual(preutfylt);
    });

    it.each(TILFELLER)('Velg barn: $navn', tilfelle => {
        const { lagret, preutfylt } = lagretAvSteget(() => useVelgBarn(), tilfelle);

        expect(lagret, STEGET_LAGRER_NOE_ANNET).toEqual(preutfylt);
    });

    it.each(TILFELLER)('Om barna dine: $navn', tilfelle => {
        const { lagret, preutfylt } = lagretAvSteget(() => useOmBarnaDine(), tilfelle);

        expect(lagret, STEGET_LAGRER_NOE_ANNET).toEqual(preutfylt);
    });

    it.each(TILFELLER)('Om barnet, for hvert barn: $navn', tilfelle => {
        const preutfylt = preutfyll(tilfelle);
        for (const barn of preutfylt.barnInkludertISøknaden) {
            const { settSøknad } = brukSøknad(structuredClone(preutfylt));
            const { result, unmount } = renderHook(() => useOmBarnet(barn.id), { wrapper: TestProvidere });
            settSøknad.mockClear();

            act(() => result.current.oppdaterSøknad());

            expect(settSøknad).toHaveBeenCalledTimes(1);
            expect(settSøknad.mock.calls[0][0], STEGET_LAGRER_NOE_ANNET).toEqual(preutfylt);
            unmount();
        }
    });

    it.each(EØS_TILFELLER)('EØS for søker: $navn', async tilfelle => {
        const preutfylt = preutfyll(tilfelle);
        const { settSøknad } = brukSøknad(structuredClone(preutfylt));
        render(
            <TestProvidere mocketNettleserHistorikk={['/eøs-søker']}>
                <EøsForSøker />
            </TestProvidere>
        );
        const gåVidere = await screen.findByRole('button', { name: GÅ_VIDERE });
        settSøknad.mockClear();

        await act(() => gåVidere.click());

        expect(settSøknad).toHaveBeenCalledTimes(1);
        expect(settSøknad.mock.calls[0][0], STEGET_LAGRER_NOE_ANNET).toEqual(preutfylt);
    });

    it.each(EØS_TILFELLER)('EØS for barnet, for hvert barn: $navn', async tilfelle => {
        const preutfylt = preutfyll(tilfelle);
        for (const [indeks, barn] of preutfylt.barnInkludertISøknaden.entries()) {
            const { settSøknad } = brukSøknad(structuredClone(preutfylt));
            const { unmount } = render(
                <TestProvidere mocketNettleserHistorikk={[`/eøs-barn/barn/${indeks + 1}`]}>
                    <EøsForBarn barnetsId={barn.id} />
                </TestProvidere>
            );
            const gåVidere = await screen.findByRole('button', { name: GÅ_VIDERE });
            settSøknad.mockClear();

            await act(() => gåVidere.click());

            expect(settSøknad).toHaveBeenCalledTimes(1);
            expect(settSøknad.mock.calls[0][0], STEGET_LAGRER_NOE_ANNET).toEqual(preutfylt);
            unmount();
        }
    });
});

describe('Søknaden godtar den preutfylte søknaden', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });

    // Oppsummeringen kjører valideringen til alle stegene, så den stopper en søknad som mangler svar. Den er tregest
    // å teste, så den kjøres for kombinasjonene av avvik og for sivilstandene, som styrer hvilke spørsmål som vises.
    it.each([...TILFELLER_MED_KOMBINASJONER, ...TILFELLER_MED_SIVILSTAND])(
        'skal komme videre fra oppsummeringen uten feil: $navn',
        async tilfelle => {
            brukSøknad(preutfyll(tilfelle));
            render(
                <TestProvidere mocketNettleserHistorikk={['/oppsummering']}>
                    <Oppsummering />
                    <LesUtLocation />
                </TestProvidere>
            );

            const gåVidere = await screen.findByRole('button', { name: GÅ_VIDERE });
            await act(() => gåVidere.click());

            const location = await screen.findByTestId('location');
            await waitFor(() => {
                expect(JSON.parse(location.innerHTML).pathname, SØKNADEN_GODTAS_IKKE).toEqual('/dokumentasjon');
            });
            expect(screen.queryAllByRole('heading', { name: FEILOPPSUMMERING })).toHaveLength(0);
        }
    );

    // Innsendingen er mocket, så testen viser at søknaden lar seg gjøre om til kontrakten, ikke at mottaket godtar den.
    it.each(TILFELLER)('skal kunne gjøres om til kontrakten som sendes inn: $navn', async tilfelle => {
        const forventedeBarn = [...(tilfelle.valg.barn ?? BARN).map(barn => barn.ident)];
        if (tilfelle.valg.ekstraBarnIdent) {
            forventedeBarn.push(tilfelle.valg.ekstraBarnIdent);
        }
        const erFosterbarn = !!tilfelle.valg.avvik?.includes(Avvik.FOSTERBARN);
        brukSøknad(preutfyll(tilfelle));
        const { result } = renderHook(() => useSendInnSkjema(), { wrapper: TestProvidereForSanity });

        const [, kontrakt] = await result.current.sendInnSkjema();

        expect(kontrakt.barn.map(barn => barn.ident.verdi.nb)).toEqual(forventedeBarn);
        expect(kontrakt.antallEøsSteg).toBe(erEøs(tilfelle) ? 1 + forventedeBarn.length : 0);
        expect(kontrakt.søker.harEøsSteg).toBe(erEøs(tilfelle));
        expect(kontrakt.barn.map(barn => barn.harEøsSteg)).toEqual(forventedeBarn.map(() => erEøs(tilfelle)));
        expect(kontrakt.barn.map(barn => barn.andreForelder === null)).toEqual(forventedeBarn.map(() => erFosterbarn));
    });
});

// Svar stegene bare tar vare på, og som testene over derfor ikke fanger.
describe('byggPreutfyltSøknad', () => {
    it.each(Object.values(Scenario))('skal markere søknaden som bekreftet og fylt ut for %s', scenario => {
        const søknad = preutfyll({ valg: { scenario } });

        expect(søknad.lestOgForståttBekreftelse).toBe(true);
        expect(søknad.barnInkludertISøknaden.map(barn => barn.barnErFyltUt)).toEqual(BARN.map(() => true));
        expect(søknad.søknadstype).toBe(scenario === Scenario.UTVIDET ? ESøknadstype.UTVIDET : ESøknadstype.ORDINÆR);
        expect(søknad.erEøs).toBe(erEøs({ navn: scenario, valg: { scenario } }));
    });

    it('skal bare la søkeren utløse EØS når søkeren selv har arbeidet i et EØS-land', () => {
        expect(preutfyll({ valg: { scenario: Scenario.EØS_SØKER } }).søker.triggetEøs).toBe(true);
        expect(preutfyll({ valg: { scenario: Scenario.EØS_BARN } }).søker.triggetEøs).toBe(false);
        expect(preutfyll({ valg: { scenario: Scenario.EØS_ANDRE_FORELDER } }).søker.triggetEøs).toBe(false);
    });

    it('skal bare oppgi adresse i søkeperioden når søkeren selv utløser EØS', () => {
        expect(preutfyll({ valg: { scenario: Scenario.EØS_SØKER } }).søker.adresseISøkeperiode.svar).not.toBe('');
        expect(preutfyll({ valg: { scenario: Scenario.EØS_BARN } }).søker.adresseISøkeperiode.svar).toBe('');
        expect(preutfyll({ valg: {} }).søker.adresseISøkeperiode.svar).toBe('');
    });

    it('skal bare svare på spørsmålet om separasjon for en søker som er registrert som gift', () => {
        const utvidet = (type: ESivilstand) =>
            preutfyll({ valg: { scenario: Scenario.UTVIDET }, søker: { sivilstand: { type } } }).søker.utvidet.spørsmål;

        expect(utvidet(ESivilstand.GIFT).separertEnkeSkilt.svar).toBe(ESvar.NEI);
        expect(utvidet(ESivilstand.UGIFT).separertEnkeSkilt.svar).toBeNull();
        expect(preutfyll({ valg: {} }).søker.utvidet.spørsmål.separertEnkeSkilt.svar).toBeNull();
    });

    it('skal ikke svare på spørsmålet om adresse for en søker med adressebeskyttelse', () => {
        const søker = { adresse: null, adressebeskyttelse: true };

        expect(preutfyll({ valg: {} }).søker.borPåRegistrertAdresse.svar).toBe(ESvar.JA);
        expect(preutfyll({ valg: {}, søker }).søker.borPåRegistrertAdresse.svar).toBeNull();
    });

    it('skal ikke oppgi slektsforhold eller andre forelder for fosterbarn', () => {
        const [barn] = preutfyll({
            valg: { scenario: Scenario.EØS_SØKER, avvik: [Avvik.FOSTERBARN] },
        }).barnInkludertISøknaden;
        const [barnMedForelder] = preutfyll({ valg: { scenario: Scenario.EØS_SØKER } }).barnInkludertISøknaden;

        expect(barn.søkersSlektsforhold.svar).toBe('');
        expect(barn.andreForelder).toBeNull();
        expect(barnMedForelder.søkersSlektsforhold.svar).toBe(Slektsforhold.FORELDER);
        expect(barnMedForelder.andreForelder).not.toBeNull();
    });

    it('skal bare ta med barna som er valgt, og barnet som er lagt til med fødselsnummer', () => {
        const søknad = preutfyll({ valg: { barn: [BARN[1]], ekstraBarnIdent: EKSTRA_BARN_IDENT } });

        expect(søknad.barnInkludertISøknaden.map(barn => barn.ident)).toEqual([BARN[1].ident, EKSTRA_BARN_IDENT]);
        expect(søknad.barnRegistrertManuelt.map(barn => barn.ident)).toEqual([EKSTRA_BARN_IDENT]);
    });

    it('skal nekte å bygge en søknad med valg som ikke kan kombineres', () => {
        expect(() => preutfyll({ valg: { avvik: [Avvik.FOSTERBARN, Avvik.DELT_BOSTED] } })).toThrow(
            'Fosterbarn kan ikke kombineres med avtale om delt bosted.'
        );
        expect(() =>
            byggPreutfyltSøknad(preutfyll({ valg: {} }), {
                scenario: Scenario.EØS_ANDRE_FORELDER,
                avvik: [Avvik.FOSTERBARN],
                barn: BARN,
                eøsLand: EØS_LAND,
            })
        ).toThrow(/^Fosterbarn kan ikke kombineres med scenarioet/);
    });
});

describe('finnUgyldigKombinasjon', () => {
    it('skal godta fosterbarn sammen med valg som ikke gjelder den andre forelderen', () => {
        expect(
            finnUgyldigKombinasjon({ scenario: Scenario.EØS_SØKER, avvik: [Avvik.FOSTERBARN, Avvik.INSTITUSJON] })
        ).toBeUndefined();
    });

    it('skal avvise fosterbarn sammen med avtale om delt bosted', () => {
        expect(
            finnUgyldigKombinasjon({ scenario: Scenario.ORDINÆR, avvik: [Avvik.FOSTERBARN, Avvik.DELT_BOSTED] })
        ).toBeDefined();
    });

    it('skal avvise fosterbarn når den andre forelderen arbeider i et EØS-land', () => {
        expect(
            finnUgyldigKombinasjon({ scenario: Scenario.EØS_ANDRE_FORELDER, avvik: [Avvik.FOSTERBARN] })
        ).toBeDefined();
    });
});
