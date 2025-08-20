import { test, expect } from '@playwright/test';

import { fullførForsideOgGåVidere, fullførOmDegOgGåVidere } from './fullførStegOgGåVidere';
import { hentFieldset } from './locator-utils';

const url = 'http://localhost:3000/barnetrygd/soknad/';

test('burde kunne gå videre hvis man fyller ut alle feltene', async ({ page }) => {
    await page.goto(url);

    await fullførForsideOgGåVidere(page);
    await fullførOmDegOgGåVidere(page);

    await page
        .getByLabel('Hva er årsaken til at du søker om utvidet barnetrygd?')
        .selectOption('Jeg er separert');

    await hentFieldset(
        page,
        'Er du separert, skilt eller enke/enkemann uten at dette er registrert i folkeregisteret i Norge?'
    )
        .getByRole('radio', { name: 'Nei' })
        .setChecked(true);

    await hentFieldset(page, 'Har du en annen samboer enn din ektefelle nå?')
        .getByRole('radio', { name: 'Nei' })
        .setChecked(true);

    await hentFieldset(page, 'Har du hatt samboer tidligere i perioden du søker barnetrygd for?')
        .getByRole('radio', { name: 'Nei' })
        .setChecked(true);

    await hentFieldset(page, 'Er du asylsøker?')
        .getByRole('radio', { name: 'Nei' })
        .setChecked(true);

    await hentFieldset(
        page,
        'Arbeider eller har du arbeidet utenfor Norge, på utenlandsk skip eller på utenlandsk kontinentalsokkel?'
    )
        .getByRole('radio', { name: 'Nei' })
        .setChecked(true);

    await hentFieldset(page, 'Får eller har du fått pensjon fra utlandet?')
        .getByRole('radio', { name: 'Nei' })
        .setChecked(true);

    await page.getByRole('button', { name: 'Neste steg' }).click();

    await expect(page.getByRole('heading', { name: 'Hvilke barn søker du for?' })).toBeVisible();
});

test('burde vise feilmelding hvis man prøver å gå videre uten å svare på spørsmålene', async ({
    page,
}) => {
    await page.goto(url);

    await fullførForsideOgGåVidere(page);
    await fullførOmDegOgGåVidere(page);

    await page.getByRole('button', { name: 'Neste steg' }).click();

    await expect(
        page
            .getByText('Du må velge årsak til at du søker om utvidet barnetrygd for å gå videre')
            .first()
    ).toBeVisible();

    await expect(
        page
            .getByText(
                'Du må oppgi om du er separert, skilt eller enke/enkemann uten at dette er registrert i folkeregisteret i Norge for å gå videre'
            )
            .first()
    ).toBeVisible();

    await expect(
        page
            .getByText('Du må oppgi om du har en annen samboer enn din ektefelle for å gå videre')
            .first()
    ).toBeVisible();

    await expect(
        page
            .getByText(
                'Du må oppgi om du har hatt samboer tidligere i perioden du søker barnetrygd for for å gå videre'
            )
            .first()
    ).toBeVisible();

    await expect(
        page.getByText('Du må oppgi om du er asylsøker for å gå videre').first()
    ).toBeVisible();

    await expect(
        page
            .getByText(
                'Du må oppgi om du arbeider eller har arbeidet utenfor Norge, på utenlandsk skip eller på utenlandsk kontinentalsokkel for å gå videre'
            )
            .first()
    ).toBeVisible();

    await expect(
        page
            .getByText('Du må oppgi om du får eller har fått pensjon fra utlandet for å gå videre')
            .first()
    ).toBeVisible();
});

test('burde kunne gå tilbake til Om deg', async ({ page }) => {
    await page.goto(url);

    await fullførForsideOgGåVidere(page);
    await fullførOmDegOgGåVidere(page);

    await page.getByRole('button', { name: 'Forrige steg' }).click();

    await expect(page.getByRole('heading', { name: 'Om deg' })).toBeVisible();
});
