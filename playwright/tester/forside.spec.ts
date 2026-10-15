import { BASE_PATH } from '../../src/common/miljø';
import { expect, test } from '../fixtures';

test.describe('Forside', () => {
    test('skal vise forsiden med navnet til søkeren', async ({ page }) => {
        await page.goto(BASE_PATH);

        await expect(page.getByRole('heading', { level: 1, name: 'Søknad om barnetrygd' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Hei, Voksen Voksnessen!' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Start søknad' })).toBeVisible();
    });

    test('skal kreve svar og bekreftelse før søknaden kan startes', async ({ page }) => {
        await page.goto(BASE_PATH);

        await page.getByRole('button', { name: 'Start søknad' }).click();

        await expect(
            page.getByText(
                'Du må velge om du skal søke både om utvidet og ordinær barnetrygd, eller bare om ordinær barnetrygd.'
            )
        ).toBeVisible();
        await expect(
            page.getByText(
                'Du må bekrefte at du vil svare så riktig som du kan på spørsmålene før du kan starte søknaden.'
            )
        ).toBeVisible();
        await expect(page).toHaveURL(BASE_PATH);
    });

    test('skal gå til «Om deg» når søknaden startes', async ({ page }) => {
        await page.goto(BASE_PATH);

        await page
            .getByRole('radiogroup', { name: 'Vil du søke om utvidet barnetrygd i tillegg til ordinær barnetrygd?' })
            .getByRole('radio', { name: 'Nei' })
            .check();
        await page.getByRole('checkbox', { name: 'Jeg vil svare så godt jeg kan på spørsmålene i søknaden.' }).check();
        await page.getByRole('button', { name: 'Start søknad' }).click();

        await expect(page).toHaveURL(`${BASE_PATH}om-deg`);
        await expect(page.getByRole('heading', { name: 'Om deg' })).toBeVisible();
    });
});
