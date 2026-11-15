import { ESvar } from '@navikt/familie-form-elements';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock } from 'vitest';

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
import type { IBarnMedISøknad } from '../typer/barn';
import { AlternativtSvarForInput } from '../typer/svar';
import type { ISøknad } from '../typer/søknad';
import { LesUtLocation, silenceConsoleErrors, TestProvidere, TestProvidereForSanity } from '../utils/testing';

import { Avvik, Scenario } from './scenario';
import {
    BARN,
    byggSøknadFor,
    EKSTRA_BARN_IDENT,
    erEøs,
    mockAppContextMed,
    TILFELLER,
    TILFELLER_MED_KOMBINASJONER,
    TILFELLER_MED_SIVILSTAND,
} from './testoppsett';

const GÅ_VIDERE = 'FELLES.navigasjon.gaaVidereKnapp';
const FEILOPPSUMMERING = 'FELLES.navigasjon.duMaaRetteOppFoelgende';
const EØS_TILFELLER = TILFELLER.filter(erEøs);

const STEGET_LAGRER_NOE_ANNET =
    'Steget i søknaden lagrer noe annet enn testverktøyet for preutfylling har skrevet. Oppdater ' +
    'byggPreutfyltSøknad.ts, eller slett verktøyet hvis ingen bruker det. Se src/frontend/preutfylling/README.md.';
const SØKNADEN_GODTAS_IKKE =
    'Søknaden godtar ikke lenger det testverktøyet for preutfylling skriver. Oppdater byggPreutfyltSøknad.ts, ' +
    'eller slett verktøyet hvis ingen bruker det. Se src/frontend/preutfylling/README.md.';

describe('Stegene i søknaden lagrer det samme som verktøyet har skrevet', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });

    const forventUendret = (settSøknad: Mock, preutfylt: ISøknad, barn?: IBarnMedISøknad) => {
        const melding = barn ? `${STEGET_LAGRER_NOE_ANNET} Gjelder ${barn.navn}.` : STEGET_LAGRER_NOE_ANNET;

        expect(settSøknad).toHaveBeenCalledTimes(1);
        expect(settSøknad.mock.calls[0][0], melding).toEqual(preutfylt);
    };

    const STEG_SOM_GJELDER_HELE_SØKNADEN: { steg: string; brukSteget: () => { oppdaterSøknad: () => void } }[] = [
        { steg: 'Om deg', brukSteget: useOmdeg },
        { steg: 'Din livssituasjon', brukSteget: useDinLivssituasjon },
        { steg: 'Velg barn', brukSteget: useVelgBarn },
        { steg: 'Om barna dine', brukSteget: useOmBarnaDine },
    ];

    describe.each(STEG_SOM_GJELDER_HELE_SØKNADEN)('$steg', ({ brukSteget }) => {
        it.each(TILFELLER)('$navn', tilfelle => {
            const preutfylt = byggSøknadFor(tilfelle);
            const { settSøknad } = mockAppContextMed(preutfylt);
            const { result } = renderHook(brukSteget, { wrapper: TestProvidere });
            expect(
                settSøknad,
                'EøsContext er uenig med verktøyet om søknaden er en EØS-søknad.'
            ).not.toHaveBeenCalled();

            act(() => result.current.oppdaterSøknad());

            forventUendret(settSøknad, preutfylt);
        });
    });

    it.each(TILFELLER)('Om barnet, for hvert barn: $navn', tilfelle => {
        const preutfylt = byggSøknadFor(tilfelle);
        for (const barn of preutfylt.barnInkludertISøknaden) {
            const { settSøknad } = mockAppContextMed(preutfylt);
            const { result, unmount } = renderHook(() => useOmBarnet(barn.id), { wrapper: TestProvidere });
            expect(
                settSøknad,
                'EøsContext er uenig med verktøyet om søknaden er en EØS-søknad.'
            ).not.toHaveBeenCalled();

            act(() => result.current.oppdaterSøknad());

            forventUendret(settSøknad, preutfylt, barn);
            unmount();
        }
    });

    it.each(EØS_TILFELLER)('EØS for søker: $navn', async tilfelle => {
        const preutfylt = byggSøknadFor(tilfelle);
        const { settSøknad } = mockAppContextMed(preutfylt);
        render(
            <TestProvidere mocketNettleserHistorikk={['/eøs-søker']}>
                <EøsForSøker />
            </TestProvidere>
        );
        const gåVidere = await screen.findByRole('button', { name: GÅ_VIDERE });
        expect(settSøknad, 'EøsContext er uenig med verktøyet om søknaden er en EØS-søknad.').not.toHaveBeenCalled();

        await act(() => gåVidere.click());

        forventUendret(settSøknad, preutfylt);
    });

    it.each(EØS_TILFELLER)('EØS for barnet, for hvert barn: $navn', async tilfelle => {
        const preutfylt = byggSøknadFor(tilfelle);
        for (const [indeks, barn] of preutfylt.barnInkludertISøknaden.entries()) {
            const { settSøknad } = mockAppContextMed(preutfylt);
            const { unmount } = render(
                <TestProvidere mocketNettleserHistorikk={[`/eøs-barn/barn/${indeks + 1}`]}>
                    <EøsForBarn barnetsId={barn.id} />
                </TestProvidere>
            );
            const gåVidere = await screen.findByRole('button', { name: GÅ_VIDERE });
            expect(
                settSøknad,
                'EøsContext er uenig med verktøyet om søknaden er en EØS-søknad.'
            ).not.toHaveBeenCalled();

            await act(() => gåVidere.click());

            forventUendret(settSøknad, preutfylt, barn);
            unmount();
        }
    });
});

describe('Søknaden godtar den preutfylte søknaden', () => {
    beforeEach(() => {
        silenceConsoleErrors();
    });

    it.each([...TILFELLER_MED_KOMBINASJONER, ...TILFELLER_MED_SIVILSTAND])(
        'skal komme videre fra oppsummeringen uten feil: $navn',
        async tilfelle => {
            mockAppContextMed(byggSøknadFor(tilfelle));
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

    it.each(TILFELLER)('skal kunne gjøres om til kontrakten som sendes inn: $navn', async tilfelle => {
        const forventedeIdenter = (tilfelle.valg.barn ?? BARN).map(barn => barn.ident);
        if (tilfelle.valg.ekstraBarnIdent) {
            forventedeIdenter.push(tilfelle.valg.ekstraBarnIdent);
        }
        const erFosterbarn = !!tilfelle.valg.avvik?.includes(Avvik.FOSTERBARN);
        mockAppContextMed(byggSøknadFor(tilfelle));
        const { result } = renderHook(() => useSendInnSkjema(), { wrapper: TestProvidereForSanity });

        const [, kontrakt] = await result.current.sendInnSkjema();

        expect(kontrakt.barn.map(barn => barn.ident.verdi.nb)).toEqual(forventedeIdenter);
        expect(kontrakt.antallEøsSteg).toBe(erEøs(tilfelle) ? 1 + forventedeIdenter.length : 0);
        expect(kontrakt.søker.harEøsSteg).toBe(erEøs(tilfelle));
        expect(kontrakt.barn.map(barn => barn.harEøsSteg)).toEqual(forventedeIdenter.map(() => erEøs(tilfelle)));
        expect(kontrakt.barn.map(barn => barn.andreForelder === null)).toEqual(
            forventedeIdenter.map(() => erFosterbarn)
        );
    });
});

describe('byggPreutfyltSøknad', () => {
    it.each(Object.values(Scenario))(
        'skal markere søknaden og barna som fylt ut, og sette søknadstype og EØS for %s',
        scenario => {
            const søknad = byggSøknadFor({ valg: { scenario } });

            expect(søknad.lestOgForståttBekreftelse).toBe(true);
            expect(søknad.barnInkludertISøknaden.map(barn => barn.barnErFyltUt)).toEqual(BARN.map(() => true));
            expect(søknad.søknadstype).toBe(
                scenario === Scenario.UTVIDET ? ESøknadstype.UTVIDET : ESøknadstype.ORDINÆR
            );
            expect(søknad.erEøs).toBe(scenario !== Scenario.ORDINÆR && scenario !== Scenario.UTVIDET);
        }
    );

    it('skal bare la søkeren utløse EØS når søkeren selv arbeider i et EØS-land', () => {
        expect(byggSøknadFor({ valg: { scenario: Scenario.EØS_SØKER } }).søker.triggetEøs).toBe(true);
        expect(byggSøknadFor({ valg: { scenario: Scenario.EØS_BARN } }).søker.triggetEøs).toBe(false);
        expect(byggSøknadFor({ valg: { scenario: Scenario.EØS_ANDRE_FORELDER } }).søker.triggetEøs).toBe(false);
    });

    it('skal bare oppgi adresse i søkeperioden når søkeren selv utløser EØS', () => {
        expect(byggSøknadFor({ valg: { scenario: Scenario.EØS_SØKER } }).søker.adresseISøkeperiode.svar).not.toBe('');
        expect(byggSøknadFor({ valg: { scenario: Scenario.EØS_BARN } }).søker.adresseISøkeperiode.svar).toBe('');
        expect(byggSøknadFor().søker.adresseISøkeperiode.svar).toBe('');
    });

    it('skal bare svare på spørsmålet om separasjon for en søker som er registrert som gift', () => {
        const utvidet = (type: ESivilstand) =>
            byggSøknadFor({ valg: { scenario: Scenario.UTVIDET }, søker: { sivilstand: { type } } }).søker.utvidet
                .spørsmål;

        expect(utvidet(ESivilstand.GIFT).separertEnkeSkilt.svar).toBe(ESvar.NEI);
        expect(utvidet(ESivilstand.UGIFT).separertEnkeSkilt.svar).toBeNull();
        expect(byggSøknadFor().søker.utvidet.spørsmål.separertEnkeSkilt.svar).toBeNull();
    });

    it('skal ikke svare på spørsmålet om adresse for en søker med adressebeskyttelse', () => {
        const søker = { adresse: null, adressebeskyttelse: true };

        expect(byggSøknadFor().søker.borPåRegistrertAdresse.svar).toBe(ESvar.JA);
        expect(byggSøknadFor({ valg: {}, søker }).søker.borPåRegistrertAdresse.svar).toBeNull();
    });

    it('skal la skjulte spørsmål stå ubesvart i en ordinær søknad uten avvik', () => {
        const { søker, barnInkludertISøknaden, erAvdødPartnerForelder } = byggSøknadFor();
        const [barn] = barnInkludertISøknaden;

        expect(søker.utvidet.spørsmål.årsak.svar).toBe('');
        expect(søker.utvidet.spørsmål.harSamboerNå.svar).toBeNull();
        expect(søker.utvidet.spørsmål.hattAnnenSamboerForSøktPeriode.svar).toBeNull();
        expect(erAvdødPartnerForelder.svar).toBeNull();
        expect(barn.andreForelder?.utvidet.søkerHarBoddMedAndreForelder.svar).toBeNull();
        expect(barn.pågåendeSøknadFraAnnetEøsLand.svar).toBeNull();
        expect(barn.mottarEllerMottokEøsBarnetrygd.svar).toBeNull();
        expect(barn.planleggerÅBoINorge12Mnd.svar).toBeNull();
    });

    it('skal bare svare på spørsmålet om samme forelder for barna etter det første', () => {
        const [førsteBarn, andreBarn] = byggSøknadFor().barnInkludertISøknaden;

        expect(førsteBarn.sammeForelderSomAnnetBarnMedId.svar).toBeNull();
        expect(andreBarn.sammeForelderSomAnnetBarnMedId.svar).toBe(AlternativtSvarForInput.ANNEN_FORELDER);
    });

    it('skal ikke oppgi slektsforhold eller andre forelder for fosterbarn', () => {
        const [barn] = byggSøknadFor({
            valg: { scenario: Scenario.EØS_SØKER, avvik: [Avvik.FOSTERBARN] },
        }).barnInkludertISøknaden;
        const [barnMedForelder] = byggSøknadFor({ valg: { scenario: Scenario.EØS_SØKER } }).barnInkludertISøknaden;

        expect(barn.søkersSlektsforhold.svar).toBe('');
        expect(barn.andreForelder).toBeNull();
        expect(barnMedForelder.søkersSlektsforhold.svar).toBe(Slektsforhold.FORELDER);
        expect(barnMedForelder.andreForelder).not.toBeNull();
    });

    it('skal bare ta med barna som er valgt, og barnet som er lagt til med fødselsnummer', () => {
        const søknad = byggSøknadFor({ valg: { barn: [BARN[1]], ekstraBarnIdent: EKSTRA_BARN_IDENT } });

        expect(søknad.barnInkludertISøknaden.map(barn => barn.ident)).toEqual([BARN[1].ident, EKSTRA_BARN_IDENT]);
        expect(søknad.barnRegistrertManuelt.map(barn => barn.ident)).toEqual([EKSTRA_BARN_IDENT]);
    });

    it('skal nekte å bygge en søknad med valg som ikke kan kombineres', () => {
        expect(() => byggSøknadFor({ valg: { avvik: [Avvik.FOSTERBARN, Avvik.DELT_BOSTED] } })).toThrow(
            'Fosterbarn kan ikke kombineres med avtale om delt bosted.'
        );
        expect(() =>
            byggSøknadFor({ valg: { scenario: Scenario.EØS_ANDRE_FORELDER, avvik: [Avvik.FOSTERBARN] } })
        ).toThrow(/^Fosterbarn kan ikke kombineres med scenarioet/);
    });
});
