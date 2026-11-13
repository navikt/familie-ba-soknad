import { byggSuksessRessurs } from '@navikt/familie-typer';
import type { Page } from '@playwright/test';
import { HttpResponse, http } from 'msw';

import { mockPersonOpplysning } from '../../mocks/testdata/personopplysning';
import { urlMedBasePath } from '../../mocks/utils';
import { BASE_PATH } from '../../src/common/miljø';
import { ESøknadstype } from '../../src/common/typer/kontrakt/generelle';
import type { ISøknadKontrakt } from '../../src/common/typer/kontrakt/kontrakt';
import { expect, test } from '../fixtures';
import { BARN, erInnsending, forventSteg, gåTilNesteSteg, oppsummeringsbolk, Steg } from '../søknad';

// Lokalt vises panelet bare med ?preutfylling i adressen, se skalVisePreutfylling.
const FORSIDE_MED_PREUTFYLLING = `${BASE_PATH}?preutfylling`;
const PREUTFYLL = 'Preutfyll og gå til oppsummering';

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

async function preutfyll(
    page: Page,
    { scenario = 'Happy case – ordinær barnetrygd uten avvik', avvik = [] as string[] } = {}
) {
    await page.getByRole('combobox', { name: 'Scenario' }).selectOption(scenario);
    for (const etAvvik of avvik) {
        await page.getByRole('checkbox', { name: etAvvik, exact: true }).check();
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

const AVVIK: { navn: string; forvent: (søknad: ISøknadKontrakt) => void }[] = [
    {
        navn: 'Skriftlig avtale om delt bosted',
        forvent: søknad => expect(søknad.barn[0].andreForelder?.skriftligAvtaleOmDeltBosted?.verdi.nb).toBe('JA'),
    },
    {
        navn: 'Barna bor ikke fast sammen med søker',
        forvent: søknad => expect(svarFraBarnet(søknad, 'borFastMedSøker')).toBe('NEI'),
    },
    {
        navn: 'Søker er asylsøker',
        forvent: søknad => expect(svarFraSøker(søknad, 'erAsylsøker')).toBe('JA'),
    },
    {
        navn: 'Det er søkt om asyl for barna',
        forvent: søknad => expect(svarFraBarnet(søknad, 'erAsylsøker')).toBe('JA'),
    },
    {
        navn: 'Barna er adoptert fra utlandet',
        forvent: søknad => expect(svarFraBarnet(søknad, 'erAdoptertFraUtland')).toBe('JA'),
    },
    {
        navn: 'Barna er fosterbarn',
        forvent: søknad => {
            expect(svarFraBarnet(søknad, 'erFosterbarn')).toBe('JA');
            expect(søknad.barn[0].andreForelder).toBeNull();
        },
    },
    {
        navn: 'Barna bor i institusjon',
        forvent: søknad => expect(svarFraBarnet(søknad, 'oppholderSegIInstitusjon')).toBe('JA'),
    },
    {
        navn: 'Søker har oppholdt seg utenfor Norge de siste 12 månedene',
        forvent: søknad => {
            expect(svarFraSøker(søknad, 'værtINorgeITolvMåneder')).toBe('NEI');
            expect(søknad.søker.utenlandsperioder).toHaveLength(1);
        },
    },
    {
        navn: 'Barna har oppholdt seg utenfor Norge de siste 12 månedene',
        forvent: søknad => {
            expect(svarFraBarnet(søknad, 'boddMindreEnn12MndINorge')).toBe('JA');
            expect(søknad.barn[0].utenlandsperioder).toHaveLength(1);
        },
    },
];
const AVVIK_SOM_PASSER_MED_ANDRE_FORELDER = AVVIK.map(avvik => avvik.navn).filter(
    navn => navn !== 'Barna er fosterbarn'
);

test.describe('Preutfylling i testmiljø', () => {
    test('skal ikke vises lokalt uten ?preutfylling i adressen', async ({ page }) => {
        await page.goto(BASE_PATH);

        await expect(page.getByRole('button', { name: 'Start søknad' })).toBeVisible();
        await expect(page.getByRole('button', { name: PREUTFYLL })).toBeHidden();
    });

    test('skal sende inn en ordinær søknad', async ({ page }) => {
        await page.goto(FORSIDE_MED_PREUTFYLLING);

        await preutfyll(page);

        await forventSteg(page, Steg.Oppsummering);
        await expect(oppsummeringsbolk(page, '3. Hvilke barn søker du for?').getByText(BARN.navn)).toBeVisible();
        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.søknadstype).toBe(ESøknadstype.ORDINÆR);
        expect(søknad.antallEøsSteg).toBe(0);
        expect(søknad.barn.map(barn => barn.ident.verdi.nb)).toEqual([BARN.ident]);
    });

    test('skal sende inn en søknad om utvidet barnetrygd', async ({ page }) => {
        await page.goto(FORSIDE_MED_PREUTFYLLING);

        await preutfyll(page, { scenario: 'Utvidet barnetrygd' });

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.søknadstype).toBe(ESøknadstype.UTVIDET);
    });

    test('skal sende inn en søknad der søkeren har arbeidet i et EØS-land', async ({ page }) => {
        await page.goto(FORSIDE_MED_PREUTFYLLING);

        await preutfyll(page, { scenario: 'EØS – søker har arbeidet i et EØS-land' });

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.antallEøsSteg).toBe(2);
        expect(søknad.søker.harEøsSteg).toBe(true);
        expect(søknad.søker.arbeidsperioderUtland).toHaveLength(1);
        expect(søknad.barn[0].harEøsSteg).toBe(true);
    });

    test('skal sende inn en søknad der barna får barnetrygd fra et EØS-land', async ({ page }) => {
        await page.goto(FORSIDE_MED_PREUTFYLLING);

        await preutfyll(page, { scenario: 'EØS – barna får barnetrygd fra et EØS-land' });

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.antallEøsSteg).toBe(2);
        expect(søknad.barn[0].harEøsSteg).toBe(true);
        expect(søknad.barn[0].eøsBarnetrygdsperioder).toHaveLength(1);
    });

    test('skal sende inn en søknad der den andre forelderen arbeider i et EØS-land', async ({ page }) => {
        await page.goto(FORSIDE_MED_PREUTFYLLING);

        await preutfyll(page, { scenario: 'EØS – den andre forelderen arbeider i et EØS-land' });

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.antallEøsSteg).toBe(2);
        expect(søknad.barn[0].harEøsSteg).toBe(true);
        expect(søknad.barn[0].andreForelder?.arbeidsperioderUtland).toHaveLength(1);
    });

    for (const { navn, forvent } of AVVIK) {
        test(`skal sende inn en søknad med avviket «${navn}»`, async ({ page }) => {
            await page.goto(FORSIDE_MED_PREUTFYLLING);

            await preutfyll(page, { avvik: [navn] });

            const søknad = await sendInnFraOppsummeringen(page);
            forvent(søknad);
            expect(søknad.antallEøsSteg).toBe(0);
        });
    }

    for (const scenario of [
        'Utvidet barnetrygd',
        'EØS – søker har arbeidet i et EØS-land',
        'EØS – barna får barnetrygd fra et EØS-land',
        'EØS – den andre forelderen arbeider i et EØS-land',
    ]) {
        test(`skal kunne kombinere «${scenario}» med alle avvik som passer sammen`, async ({ page }) => {
            await page.goto(FORSIDE_MED_PREUTFYLLING);

            await preutfyll(page, { scenario, avvik: AVVIK_SOM_PASSER_MED_ANDRE_FORELDER });

            const søknad = await sendInnFraOppsummeringen(page);
            expect(søknad.barn[0].andreForelder?.skriftligAvtaleOmDeltBosted?.verdi.nb).toBe('JA');
            expect(svarFraBarnet(søknad, 'oppholderSegIInstitusjon')).toBe('JA');
        });
    }

    for (const scenario of ['EØS – søker har arbeidet i et EØS-land', 'EØS – barna får barnetrygd fra et EØS-land']) {
        test(`skal kunne kombinere «${scenario}» med fosterbarn`, async ({ page }) => {
            await page.goto(FORSIDE_MED_PREUTFYLLING);

            await preutfyll(page, {
                scenario,
                avvik: ['Barna er fosterbarn', 'Barna bor ikke fast sammen med søker'],
            });

            const søknad = await sendInnFraOppsummeringen(page);
            expect(svarFraBarnet(søknad, 'erFosterbarn')).toBe('JA');
            expect(søknad.barn[0].harEøsSteg).toBe(true);
        });
    }

    test('skal avvise avvik som ikke kan kombineres', async ({ page }) => {
        await page.goto(FORSIDE_MED_PREUTFYLLING);

        await preutfyll(page, { avvik: ['Barna er fosterbarn', 'Skriftlig avtale om delt bosted'] });

        await expect(page.getByText('Fosterbarn kan ikke kombineres med avtale om delt bosted.')).toBeVisible();
        await expect(page.getByRole('button', { name: PREUTFYLL })).toBeVisible();
    });

    test('skal spørre hvilke barn søknaden gjelder når søkeren har flere barn', async ({ page, apiMock }) => {
        apiMock.use(toBarn);
        await page.goto(FORSIDE_MED_PREUTFYLLING);

        await preutfyll(page);

        await expect(page.getByText('Velg minst ett barn, eller legg til et barn med fødselsnummer.')).toBeVisible();
        await page.getByRole('checkbox', { name: new RegExp(`^${BARN_NUMMER_TO.navn}`) }).check();
        await preutfyll(page);
        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.barn.map(barn => barn.ident.verdi.nb)).toEqual([BARN_NUMMER_TO.ident]);
    });

    test('skal sende inn en EØS-søknad for flere barn', async ({ page, apiMock }) => {
        apiMock.use(toBarn);
        await page.goto(FORSIDE_MED_PREUTFYLLING);
        await page.getByRole('checkbox', { name: new RegExp(`^${BARN.navn}`) }).check();
        await page.getByRole('checkbox', { name: new RegExp(`^${BARN_NUMMER_TO.navn}`) }).check();

        await preutfyll(page, { scenario: 'EØS – den andre forelderen arbeider i et EØS-land' });

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.barn).toHaveLength(2);
        expect(søknad.antallEøsSteg).toBe(3);
    });

    test('skal kunne legge til et barn som ikke er i listen fra folkeregisteret', async ({ page, apiMock }) => {
        apiMock.use(personopplysning({ barn: [] }));
        await page.goto(FORSIDE_MED_PREUTFYLLING);
        await page
            .getByRole('textbox', { name: 'Legg til barn med fødselsnummer (valgfritt)' })
            .fill(BARN_UTENFOR_FOLKEREGISTERLISTEN);

        await preutfyll(page);

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.barn.map(barn => barn.ident.verdi.nb)).toEqual([BARN_UTENFOR_FOLKEREGISTERLISTEN]);
        expect(søknad.barn[0].registrertBostedType.verdi.nb).toBe('IKKE_FYLT_INN');
    });

    test('skal sende inn en søknad for en søker med adressebeskyttelse', async ({ page, apiMock }) => {
        apiMock.use(personopplysning({ adresse: null, adressebeskyttelse: true }));
        await page.goto(FORSIDE_MED_PREUTFYLLING);

        await preutfyll(page);

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.søker.adressebeskyttelse).toBe(true);
    });

    test('skal kunne fortsette på oppsummeringen etter at siden er lastet på nytt', async ({ page, mellomlager }) => {
        await page.goto(FORSIDE_MED_PREUTFYLLING);
        await preutfyll(page, { scenario: 'EØS – søker har arbeidet i et EØS-land' });
        await forventSteg(page, Steg.Oppsummering);
        await expect.poll(() => mellomlager.lagret()?.søknad.barnInkludertISøknaden).toHaveLength(1);

        await page.reload();
        await page.getByRole('button', { name: 'Fortsett på søknaden' }).click();

        await forventSteg(page, Steg.Oppsummering);
    });
});
