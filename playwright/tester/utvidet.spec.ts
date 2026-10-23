import { ESøknadstype } from '../../src/common/typer/kontrakt/generelle';
import type { ISøknadKontrakt } from '../../src/common/typer/kontrakt/kontrakt';
import { expect, test } from '../fixtures';
import {
    BARN,
    erInnsending,
    forventSteg,
    fyllUtDinLivssituasjon,
    fyllUtOmBarna,
    fyllUtOmBarnet,
    fyllUtOmDeg,
    fyllUtVelgBarn,
    gåTilNesteSteg,
    oppsummeringsbolk,
    Steg,
    startSøknad,
    svar,
} from '../søknad';

const ÅRSAK = 'Hva er årsaken til at du søker om utvidet barnetrygd?';

test.describe('Utvidet barnetrygd', () => {
    test.beforeEach(async ({ page }) => {
        await startSøknad(page, { utvidet: true });
        await forventSteg(page, Steg.OmDeg);
        await fyllUtOmDeg(page);
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.DinLivssituasjon);
    });

    test('skal kreve at søkeren oppgir årsaken til at hen søker om utvidet barnetrygd', async ({ page }) => {
        await fyllUtDinLivssituasjon(page);

        await gåTilNesteSteg(page);

        await expect(
            page.getByRole('link', { name: 'Du må velge årsak til at du søker om utvidet barnetrygd for å gå videre' })
        ).toBeVisible();
        await forventSteg(page, Steg.DinLivssituasjon);
    });

    test('skal sende inn søknad om utvidet barnetrygd', async ({ page }) => {
        await page.getByRole('combobox', { name: ÅRSAK }).selectOption('Jeg er skilt');
        await svar(page, /^Er du separert, skilt eller enke\/enkemann uten at dette er registrert/, 'Nei');
        await svar(page, 'Har du en annen samboer enn din ektefelle nå?', 'Nei');
        await svar(page, 'Har du hatt samboer tidligere i perioden du søker barnetrygd for?', 'Nei');
        await fyllUtDinLivssituasjon(page);
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.VelgBarn);
        await fyllUtVelgBarn(page);
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.OmBarna);
        await fyllUtOmBarna(page);
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.OmBarnet);
        await fyllUtOmBarnet(page);
        await svar(page, `Har du bodd sammen med ${BARN.navn} sin andre forelder?`, 'Nei');
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.Oppsummering);

        await expect(oppsummeringsbolk(page, '2. Livssituasjonen din').getByText('Jeg er skilt')).toBeVisible();

        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.Dokumentasjon);
        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();

        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(søknad.søknadstype).toBe(ESøknadstype.UTVIDET);
        await expect(page.getByText(/^Søknaden din om barnetrygd er mottatt/)).toBeVisible();
    });
});
