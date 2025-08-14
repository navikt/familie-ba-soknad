import { hentFieldset } from './locator-utils';

export async function fullførForsideOgGåVidere(page) {
    await hentFieldset(page, 'Vil du søke om utvidet barnetrygd i tillegg til ordinær barnetrygd?')
        .getByLabel('Ja')
        .check();

    await page
        .getByRole('checkbox', {
            name: 'Jeg vil svare så godt jeg kan på spørsmålene i søknaden.',
        })
        .check();

    await page.getByRole('button', { name: 'Start søknad' }).click();
}

export async function fullførOmDegOgGåVidere(page) {
    await hentFieldset(page, 'Bor du på denne adressen?')
        .getByRole('radio', {
            name: 'Ja',
        })
        .setChecked(true);

    await hentFieldset(page, 'Har du oppholdt deg sammenhengende i Norge de siste 12 månedene?')
        .getByRole('radio', {
            name: 'Ja',
        })
        .setChecked(true);

    await page.getByRole('button', { name: 'Neste steg' }).click();
}
