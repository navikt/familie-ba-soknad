import { test, expect } from '@playwright/test';

import { fullførForsideOgGåVidere } from './fullførStegOgGåVidere';

const url = 'http://localhost:3000/barnetrygd/soknad/';

test('har tittel', async ({ page }) => {
    await page.goto(url);

    await expect(page).toHaveTitle('Søknad om barnetrygd');
});

test('burde kunne gå videre hvis man velger type søknad og samtykker', async ({ page }) => {
    await page.goto(url);

    await fullførForsideOgGåVidere(page);

    await expect(page.getByRole('heading', { name: 'Om deg' })).toBeVisible();
});

test('burde vise feilmelding hvis man prøver å starte søknad uten å svare på om man ønsker ordinær eller utvidet søknad', async ({
    page,
}) => {
    await page.goto(url);

    await page.getByRole('button', { name: 'Start søknad' }).click();

    await expect(
        page.getByText(
            'Du må velge om du skal søke både om utvidet og ordinær barnetrygd, eller bare om ordinær barnetrygd.'
        )
    ).toBeVisible();
});

test('burde vise feilmelding hvis man prøver å starte søknad uten å samtykke', async ({ page }) => {
    await page.goto(url);

    await page.getByRole('button', { name: 'Start søknad' }).click();

    await expect(
        page.getByText(
            'Du må bekrefte at du vil svare så riktig som du kan på spørsmålene før du kan starte søknaden.'
        )
    ).toBeVisible();
});
