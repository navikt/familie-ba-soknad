import { test, expect } from '@playwright/test';

import { fullførForsideOgGåVidere, fullførOmDegOgGåVidere } from './fullførStegOgGåVidere';

const url = 'http://localhost:3000/barnetrygd/soknad/';

test('burde kunne gå videre hvis man velger at man bor på adressen og har oppholdt seg i norge i 12 måneder', async ({
    page,
}) => {
    await page.goto(url);

    await fullførForsideOgGåVidere(page);
    await fullførOmDegOgGåVidere(page);

    await expect(page.getByRole('heading', { name: 'Livssituasjonen din' })).toBeVisible();
});

test('burde vise feilmelding hvis man prøver å gå videre uten å svare på spørsmålene', async ({
    page,
}) => {
    await page.goto(url);

    await fullførForsideOgGåVidere(page);

    await page.getByRole('button', { name: 'Neste steg' }).click();

    await expect(
        page.getByText('Du må oppgi om du bor på denne adressen for å gå videre.').first()
    ).toBeVisible();

    await expect(
        page
            .getByText(
                'Du må oppgi om du har oppholdt deg sammenhengende i Norge de siste 12 månedene for å gå videre.'
            )
            .first()
    ).toBeVisible();
});

test('burde kunne gå tilbake til forsiden', async ({ page }) => {
    await page.goto(url);

    await fullførForsideOgGåVidere(page);

    await page.getByRole('button', { name: 'Forrige steg' }).click();

    await expect(page.getByRole('button', { name: 'Fortsett på søknaden' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start på nytt' })).toBeVisible();
});
