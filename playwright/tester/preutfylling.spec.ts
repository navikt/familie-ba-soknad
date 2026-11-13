import { byggSuksessRessurs } from '@navikt/familie-typer';
import type { Page } from '@playwright/test';
import { HttpResponse, http } from 'msw';

import { mockPersonOpplysning } from '../../mocks/testdata/personopplysning';
import { urlMedBasePath } from '../../mocks/utils';
import { BASE_PATH } from '../../src/common/miljø';
import { Dokumentasjonsbehov } from '../../src/common/typer/kontrakt/dokumentasjon';
import { ESøknadstype } from '../../src/common/typer/kontrakt/generelle';
import type { ISøknadKontrakt } from '../../src/common/typer/kontrakt/kontrakt';
// Testen hører til testverktøyet i src/frontend/preutfylling og skal slettes sammen med det, se README.md der.
import { Avvik, avvikNavn, Scenario, scenarioNavn } from '../../src/frontend/preutfylling/scenario';
import { expect, test } from '../fixtures';
import { BARN, erInnsending, forventSteg, gåTilNesteSteg, oppsummeringsbolk, Steg } from '../søknad';

// Lokalt vises panelet bare med ?preutfylling i adressen, se skalVisePreutfylling.
const FORSIDE_MED_PREUTFYLLING = `${BASE_PATH}?preutfylling`;
const PREUTFYLL = 'Preutfyll og gå til oppsummering';
const EKSTRA_BARN = 'Legg til barn med fødselsnummer (valgfritt)';

// Syntetiske fødselsnumre (Tenor) som ikke tilhører ekte personer.
const BARN_NUMMER_TO = { navn: 'Lille Barnessen', ident: '10832350120' };
const BARN_UTENFOR_FOLKEREGISTERLISTEN = '15859040087';

const personopplysning = (endring: object) =>
    http.get(urlMedBasePath('api/personopplysning'), () =>
        HttpResponse.json(byggSuksessRessurs({ ...mockPersonOpplysning, ...endring }))
    );

const toBarn = personopplysning({
    barn: [
        ...mockPersonOpplysning.barn,
        {
            ident: BARN_NUMMER_TO.ident,
            navn: BARN_NUMMER_TO.navn,
            borMedSøker: true,
            fødselsdato: '2023-06-01',
            adressebeskyttelse: false,
        },
    ],
});

const panelet = (page: Page) => page.getByRole('region', { name: 'Testverktøy: preutfyll søknaden' });
// Avgrenser til gruppene i panelet, siden navnet på et barn kan ligne teksten til et avvik.
const barnet = (page: Page, navn: string) =>
    panelet(page)
        .getByRole('group', { name: 'Hvilke barn skal søknaden gjelde?' })
        .getByRole('checkbox', { name: new RegExp(`^${navn}`) });
const avviket = (page: Page, avvik: Avvik) =>
    panelet(page)
        .getByRole('group', { name: /^Avvik/ })
        .getByRole('checkbox', { name: avvikNavn[avvik], exact: true });

/** Panelet er lukket til testeren åpner det. */
async function åpnePreutfylling(page: Page) {
    await page.goto(FORSIDE_MED_PREUTFYLLING);
    await panelet(page).getByRole('button', { name: 'Vis mer' }).click();
}

async function preutfyll(page: Page, { scenario = Scenario.ORDINÆR, avvik = [] as Avvik[] } = {}) {
    await page.getByRole('combobox', { name: 'Scenario' }).selectOption(scenarioNavn[scenario]);
    for (const etAvvik of avvik) {
        await avviket(page, etAvvik).check();
    }
    await page.getByRole('button', { name: PREUTFYLL }).click();
}

/** Oppsummeringen validerer alle stegene, så søknaden kommer bare videre herfra hvis alle svarene er gyldige. */
async function sendInnFraOppsummeringen(page: Page): Promise<ISøknadKontrakt> {
    await forventSteg(page, Steg.Oppsummering);
    await gåTilNesteSteg(page);
    await forventSteg(page, Steg.Dokumentasjon);

    const innsending = page.waitForRequest(erInnsending);
    await page.getByRole('button', { name: 'Send søknad' }).click();
    const søknad: ISøknadKontrakt = (await innsending).postDataJSON();

    await expect(page.getByText(/^Søknaden din om barnetrygd er mottatt/)).toBeVisible();
    return søknad;
}

const svarFraBarnet = (søknad: ISøknadKontrakt, spørsmål: string) => søknad.barn[0].spørsmål[spørsmål]?.verdi.nb;
const svarFraSøker = (søknad: ISøknadKontrakt, spørsmål: string) => søknad.søker.spørsmål[spørsmål]?.verdi.nb;
const vedleggskrav = (søknad: ISøknadKontrakt) => søknad.dokumentasjon.map(dok => dok.dokumentasjonsbehov);

// Annen dokumentasjon kan alltid lastes opp, så den er med i alle søknader.
const INGEN_VEDLEGGSKRAV = [Dokumentasjonsbehov.ANNEN_DOKUMENTASJON];

const FORVENTET_SVAR: Record<Avvik, (søknad: ISøknadKontrakt) => void> = {
    [Avvik.DELT_BOSTED]: søknad => {
        expect(søknad.barn[0].andreForelder?.skriftligAvtaleOmDeltBosted?.verdi.nb).toBe('JA');
        expect(vedleggskrav(søknad)).toContain(Dokumentasjonsbehov.AVTALE_DELT_BOSTED);
    },
    [Avvik.BOR_IKKE_FAST_MED_SØKER]: søknad => expect(svarFraBarnet(søknad, 'borFastMedSøker')).toBe('NEI'),
    [Avvik.SØKER_ER_ASYLSØKER]: søknad => {
        expect(svarFraSøker(søknad, 'erAsylsøker')).toBe('JA');
        expect(vedleggskrav(søknad)).toContain(Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE);
    },
    [Avvik.BARNA_ER_ASYLSØKERE]: søknad => {
        expect(svarFraBarnet(søknad, 'erAsylsøker')).toBe('JA');
        expect(vedleggskrav(søknad)).toContain(Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE);
    },
    [Avvik.ADOPTERT_FRA_UTLANDET]: søknad => {
        expect(svarFraBarnet(søknad, 'erAdoptertFraUtland')).toBe('JA');
        expect(vedleggskrav(søknad)).toContain(Dokumentasjonsbehov.ADOPSJON_DATO);
    },
    [Avvik.FOSTERBARN]: søknad => {
        expect(svarFraBarnet(søknad, 'erFosterbarn')).toBe('JA');
        expect(søknad.barn[0].andreForelder).toBeNull();
        expect(vedleggskrav(søknad)).toContain(Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN);
    },
    [Avvik.INSTITUSJON]: søknad => expect(svarFraBarnet(søknad, 'oppholderSegIInstitusjon')).toBe('JA'),
    [Avvik.SØKER_UTENFOR_NORGE]: søknad => {
        expect(svarFraSøker(søknad, 'værtINorgeITolvMåneder')).toBe('NEI');
        expect(søknad.søker.utenlandsperioder).toHaveLength(1);
    },
    [Avvik.BARNA_UTENFOR_NORGE]: søknad => {
        expect(svarFraBarnet(søknad, 'boddMindreEnn12MndINorge')).toBe('JA');
        expect(søknad.barn[0].utenlandsperioder).toHaveLength(1);
    },
};
const ALLE_AVVIK = Object.values(Avvik);
const AVVIK_SOM_PASSER_MED_ANDRE_FORELDER = ALLE_AVVIK.filter(avvik => avvik !== Avvik.FOSTERBARN);

test.describe('Preutfylling i testmiljø', () => {
    test('skal ikke vises lokalt uten ?preutfylling i adressen', async ({ page }) => {
        await page.goto(BASE_PATH);

        await expect(page.getByRole('button', { name: 'Start søknad' })).toBeVisible();
        await expect(panelet(page)).toBeHidden();
    });

    test('skal være lukket til testeren åpner det', async ({ page }) => {
        await page.goto(FORSIDE_MED_PREUTFYLLING);

        await expect(panelet(page)).toBeVisible();
        await expect(page.getByRole('button', { name: PREUTFYLL })).toBeHidden();
        await panelet(page).getByRole('button', { name: 'Vis mer' }).click();
        await expect(page.getByRole('button', { name: PREUTFYLL })).toBeVisible();
    });

    test('skal sende inn en ordinær søknad uten vedleggskrav', async ({ page }) => {
        await åpnePreutfylling(page);

        await preutfyll(page);

        await forventSteg(page, Steg.Oppsummering);
        await expect(oppsummeringsbolk(page, '3. Hvilke barn søker du for?').getByText(BARN.navn)).toBeVisible();
        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.søknadstype).toBe(ESøknadstype.ORDINÆR);
        expect(søknad.antallEøsSteg).toBe(0);
        expect(søknad.barn.map(barn => barn.ident.verdi.nb)).toEqual([BARN.ident]);
        expect(svarFraSøker(søknad, 'borPåRegistrertAdresse')).toBe('JA');
        expect(vedleggskrav(søknad)).toEqual(INGEN_VEDLEGGSKRAV);
    });

    test('skal sende inn en søknad om utvidet barnetrygd uten vedleggskrav', async ({ page }) => {
        await åpnePreutfylling(page);

        await preutfyll(page, { scenario: Scenario.UTVIDET });

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.søknadstype).toBe(ESøknadstype.UTVIDET);
        expect(svarFraSøker(søknad, 'harSamboerNå')).toBe('NEI');
        expect(vedleggskrav(søknad)).toEqual(INGEN_VEDLEGGSKRAV);
    });

    test('skal sende inn en søknad der søkeren har arbeidet i et EØS-land', async ({ page }) => {
        await åpnePreutfylling(page);

        await preutfyll(page, { scenario: Scenario.EØS_SØKER });

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.antallEøsSteg).toBe(2);
        expect(søknad.søker.harEøsSteg).toBe(true);
        expect(søknad.søker.arbeidsperioderUtland).toHaveLength(1);
        expect(søknad.barn[0].harEøsSteg).toBe(true);
    });

    test('skal sende inn en søknad der barna får barnetrygd fra et EØS-land', async ({ page }) => {
        await åpnePreutfylling(page);

        await preutfyll(page, { scenario: Scenario.EØS_BARN });

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.antallEøsSteg).toBe(2);
        expect(søknad.barn[0].harEøsSteg).toBe(true);
        expect(søknad.barn[0].eøsBarnetrygdsperioder).toHaveLength(1);
    });

    test('skal sende inn en søknad der den andre forelderen arbeider i et EØS-land', async ({ page }) => {
        await åpnePreutfylling(page);

        await preutfyll(page, { scenario: Scenario.EØS_ANDRE_FORELDER });

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.antallEøsSteg).toBe(2);
        expect(søknad.barn[0].harEøsSteg).toBe(true);
        expect(søknad.barn[0].andreForelder?.arbeidsperioderUtland).toHaveLength(1);
    });

    for (const avvik of ALLE_AVVIK) {
        test(`skal sende inn en søknad med avviket «${avvikNavn[avvik]}»`, async ({ page }) => {
            await åpnePreutfylling(page);

            await preutfyll(page, { avvik: [avvik] });

            const søknad = await sendInnFraOppsummeringen(page);
            FORVENTET_SVAR[avvik](søknad);
            expect(søknad.antallEøsSteg).toBe(0);
        });
    }

    for (const scenario of Object.values(Scenario).filter(scenario => scenario !== Scenario.ORDINÆR)) {
        test(`skal kunne kombinere «${scenarioNavn[scenario]}» med alle avvik som passer sammen`, async ({ page }) => {
            await åpnePreutfylling(page);

            await preutfyll(page, { scenario, avvik: AVVIK_SOM_PASSER_MED_ANDRE_FORELDER });

            const søknad = await sendInnFraOppsummeringen(page);
            for (const avvik of AVVIK_SOM_PASSER_MED_ANDRE_FORELDER) {
                FORVENTET_SVAR[avvik](søknad);
            }
            expect(søknad.antallEøsSteg > 0).toBe(scenario !== Scenario.UTVIDET);
        });
    }

    for (const scenario of [Scenario.EØS_SØKER, Scenario.EØS_BARN]) {
        test(`skal kunne kombinere «${scenarioNavn[scenario]}» med fosterbarn`, async ({ page }) => {
            await åpnePreutfylling(page);

            await preutfyll(page, { scenario, avvik: [Avvik.FOSTERBARN, Avvik.BOR_IKKE_FAST_MED_SØKER] });

            const søknad = await sendInnFraOppsummeringen(page);
            FORVENTET_SVAR[Avvik.FOSTERBARN](søknad);
            expect(søknad.barn[0].harEøsSteg).toBe(true);
        });
    }

    test('skal avvise fosterbarn sammen med avtale om delt bosted', async ({ page }) => {
        await åpnePreutfylling(page);

        await preutfyll(page, { avvik: [Avvik.FOSTERBARN, Avvik.DELT_BOSTED] });

        await expect(page.getByText('Fosterbarn kan ikke kombineres med avtale om delt bosted.')).toBeVisible();
        await expect(page.getByRole('button', { name: PREUTFYLL })).toBeVisible();
    });

    test('skal avvise fosterbarn når den andre forelderen arbeider i et EØS-land', async ({ page }) => {
        await åpnePreutfylling(page);

        await preutfyll(page, { scenario: Scenario.EØS_ANDRE_FORELDER, avvik: [Avvik.FOSTERBARN] });

        await expect(page.getByText(/^Fosterbarn kan ikke kombineres med scenarioet/)).toBeVisible();
        await expect(page.getByRole('button', { name: PREUTFYLL })).toBeVisible();
    });

    test('skal fjerne feilmeldingen når testeren endrer valgene', async ({ page }) => {
        await åpnePreutfylling(page);
        await preutfyll(page, { avvik: [Avvik.FOSTERBARN, Avvik.DELT_BOSTED] });
        await expect(page.getByText('Fosterbarn kan ikke kombineres med avtale om delt bosted.')).toBeVisible();

        await avviket(page, Avvik.DELT_BOSTED).uncheck();

        await expect(page.getByText('Fosterbarn kan ikke kombineres med avtale om delt bosted.')).toBeHidden();
    });

    test('skal spørre hvilke barn søknaden gjelder når søkeren har flere barn', async ({ page, apiMock }) => {
        apiMock.use(toBarn);
        await åpnePreutfylling(page);

        await preutfyll(page);

        await expect(page.getByText('Velg minst ett barn, eller legg til et barn med fødselsnummer.')).toBeVisible();
        await barnet(page, BARN_NUMMER_TO.navn).check();
        await preutfyll(page);
        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.barn.map(barn => barn.ident.verdi.nb)).toEqual([BARN_NUMMER_TO.ident]);
    });

    test('skal sende inn en EØS-søknad for flere barn', async ({ page, apiMock }) => {
        apiMock.use(toBarn);
        await åpnePreutfylling(page);
        await barnet(page, BARN.navn).check();
        await barnet(page, BARN_NUMMER_TO.navn).check();

        await preutfyll(page, { scenario: Scenario.EØS_ANDRE_FORELDER });

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.barn).toHaveLength(2);
        expect(søknad.antallEøsSteg).toBe(3);
    });

    test('skal kunne legge til et barn som ikke er i listen fra folkeregisteret', async ({ page, apiMock }) => {
        apiMock.use(personopplysning({ barn: [] }));
        await åpnePreutfylling(page);
        await page.getByRole('textbox', { name: EKSTRA_BARN }).fill(BARN_UTENFOR_FOLKEREGISTERLISTEN);

        await preutfyll(page);

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.barn.map(barn => barn.ident.verdi.nb)).toEqual([BARN_UTENFOR_FOLKEREGISTERLISTEN]);
        expect(søknad.barn[0].registrertBostedType.verdi.nb).toBe('IKKE_FYLT_INN');
        expect(vedleggskrav(søknad)).toContain(Dokumentasjonsbehov.BOR_FAST_MED_SØKER);
    });

    test('skal kunne søke bare for barnet som er lagt til, når søkeren har ett barn i folkeregisteret', async ({
        page,
    }) => {
        await åpnePreutfylling(page);
        await expect(barnet(page, BARN.navn)).toBeChecked();
        await barnet(page, BARN.navn).uncheck();
        await page.getByRole('textbox', { name: EKSTRA_BARN }).fill(BARN_UTENFOR_FOLKEREGISTERLISTEN);

        await preutfyll(page);

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.barn.map(barn => barn.ident.verdi.nb)).toEqual([BARN_UTENFOR_FOLKEREGISTERLISTEN]);
    });

    test('skal avvise et fødselsnummer som ikke er gyldig', async ({ page }) => {
        await åpnePreutfylling(page);
        await page.getByRole('textbox', { name: EKSTRA_BARN }).fill('12345678901');

        await preutfyll(page);

        await expect(page.getByText('Fødselsnummeret er ikke gyldig.')).toBeVisible();
        await expect(page.getByRole('button', { name: PREUTFYLL })).toBeVisible();
    });

    test('skal ikke svare på spørsmålet om adresse for en søker med adressebeskyttelse', async ({ page, apiMock }) => {
        apiMock.use(personopplysning({ adresse: null, adressebeskyttelse: true }));
        await åpnePreutfylling(page);

        await preutfyll(page);

        const søknad = await sendInnFraOppsummeringen(page);
        expect(svarFraSøker(søknad, 'værtINorgeITolvMåneder')).toBe('JA');
        expect(svarFraSøker(søknad, 'borPåRegistrertAdresse')).toBeUndefined();
    });

    test('skal kunne fortsette på oppsummeringen etter at siden er lastet på nytt', async ({ page, mellomlager }) => {
        await åpnePreutfylling(page);
        await preutfyll(page, { scenario: Scenario.EØS_SØKER });
        await forventSteg(page, Steg.Oppsummering);
        await expect.poll(() => mellomlager.lagret()?.søknad.barnInkludertISøknaden).toHaveLength(1);

        await page.reload();
        await page.getByRole('button', { name: 'Fortsett på søknaden' }).click();

        await forventSteg(page, Steg.Oppsummering);
    });
});
