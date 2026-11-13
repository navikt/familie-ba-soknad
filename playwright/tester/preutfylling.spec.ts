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

async function preutfyll(page: Page, scenario = 'Happy case – ordinær barnetrygd uten avvik') {
    await page.getByRole('combobox', { name: 'Scenario' }).selectOption(scenario);
    await page.getByRole('button', { name: 'Preutfyll og gå til oppsummering' }).click();
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

test.describe('Preutfylling i testmiljø', () => {
    test('skal sende inn en ordinær søknad', async ({ page }) => {
        await page.goto(BASE_PATH);

        await preutfyll(page);

        await forventSteg(page, Steg.Oppsummering);
        await expect(oppsummeringsbolk(page, '3. Hvilke barn søker du for?').getByText(BARN.navn)).toBeVisible();
        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.søknadstype).toBe(ESøknadstype.ORDINÆR);
        expect(søknad.antallEøsSteg).toBe(0);
        expect(søknad.barn.map(barn => barn.ident.verdi.nb)).toEqual([BARN.ident]);
    });

    test('skal sende inn en søknad om utvidet barnetrygd', async ({ page }) => {
        await page.goto(BASE_PATH);

        await preutfyll(page, 'Utvidet barnetrygd');

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.søknadstype).toBe(ESøknadstype.UTVIDET);
    });

    test('skal sende inn en søknad der søkeren har arbeidet i et EØS-land', async ({ page }) => {
        await page.goto(BASE_PATH);

        await preutfyll(page, 'EØS – søker har arbeidet i et EØS-land');

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.antallEøsSteg).toBe(2);
        expect(søknad.søker.harEøsSteg).toBe(true);
        expect(søknad.søker.arbeidsperioderUtland).toHaveLength(1);
        expect(søknad.barn[0].harEøsSteg).toBe(true);
    });

    test('skal sende inn en søknad der barna får barnetrygd fra et EØS-land', async ({ page }) => {
        await page.goto(BASE_PATH);

        await preutfyll(page, 'EØS – barna får barnetrygd fra et EØS-land');

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.antallEøsSteg).toBe(2);
        expect(søknad.barn[0].harEøsSteg).toBe(true);
        expect(søknad.barn[0].eøsBarnetrygdsperioder).toHaveLength(1);
    });

    test('skal sende inn en søknad der den andre forelderen arbeider i et EØS-land', async ({ page }) => {
        await page.goto(BASE_PATH);

        await preutfyll(page, 'EØS – den andre forelderen arbeider i et EØS-land');

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.antallEøsSteg).toBe(2);
        expect(søknad.barn[0].harEøsSteg).toBe(true);
        expect(søknad.barn[0].andreForelder?.arbeidsperioderUtland).toHaveLength(1);
    });

    test('skal spørre hvilke barn søknaden gjelder når søkeren har flere barn', async ({ page, apiMock }) => {
        apiMock.use(toBarn);
        await page.goto(BASE_PATH);

        await preutfyll(page);

        await expect(page.getByText('Velg minst ett barn, eller legg til et barn med fødselsnummer.')).toBeVisible();
        await page.getByRole('checkbox', { name: new RegExp(`^${BARN_NUMMER_TO.navn}`) }).check();
        await preutfyll(page);
        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.barn.map(barn => barn.ident.verdi.nb)).toEqual([BARN_NUMMER_TO.ident]);
    });

    test('skal sende inn en EØS-søknad for flere barn', async ({ page, apiMock }) => {
        apiMock.use(toBarn);
        await page.goto(BASE_PATH);
        await page.getByRole('checkbox', { name: new RegExp(`^${BARN.navn}`) }).check();
        await page.getByRole('checkbox', { name: new RegExp(`^${BARN_NUMMER_TO.navn}`) }).check();

        await preutfyll(page, 'EØS – den andre forelderen arbeider i et EØS-land');

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.barn).toHaveLength(2);
        expect(søknad.antallEøsSteg).toBe(3);
    });

    test('skal kunne legge til et barn som ikke er i listen fra folkeregisteret', async ({ page, apiMock }) => {
        apiMock.use(personopplysning({ barn: [] }));
        await page.goto(BASE_PATH);
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
        await page.goto(BASE_PATH);

        await preutfyll(page);

        const søknad = await sendInnFraOppsummeringen(page);
        expect(søknad.søker.adressebeskyttelse).toBe(true);
    });
});
