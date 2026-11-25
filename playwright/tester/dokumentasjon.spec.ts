import type { Page } from '@playwright/test';
import { HttpResponse, http } from 'msw';

import { Dokumentasjonsbehov } from '../../src/common/typer/kontrakt/dokumentasjon';
import type { ISøknadKontrakt } from '../../src/common/typer/kontrakt/kontrakt';
import type { IDokumentasjon, IVedlegg } from '../../src/frontend/typer/dokumentasjon';
import { expect, test } from '../fixtures';
import type { Mellomlager } from '../mellomlager';
import {
    BARN,
    erInnsending,
    forventSteg,
    fyllUtOmBarnet,
    gåTilNesteSteg,
    gåTilSteg,
    lastOppFil,
    PDF,
    Steg,
    svar,
    VEDLEGG_URL,
} from '../søknad';

const SKRIFTLIG_AVTALE_SPØRSMÅL = `Har du og den andre forelderen skriftlig avtale om delt bosted for ${BARN.navn}?`;
const TIDSPUNKT_FOR_MONTERING = new Date('2026-01-15T12:00:00.000Z');
const TIMER_46 = 46 * 60 * 60 * 1000;
// Testfixtureen har ett barn uten EØS-tilknytning, så Oppsummering er steg 6.
const OPPSUMMERING_STEGINDEKS = 6;

type Dokumentasjonsendringer = Partial<
    Record<Dokumentasjonsbehov, Pick<IDokumentasjon, 'harSendtInn' | 'opplastedeVedlegg'>>
>;

function vedlegg(dokumentId: string, navn: string, tidspunkt = new Date().toISOString()): IVedlegg {
    return { dokumentId, navn, størrelse: 23, tidspunkt };
}

function endreMellomlagretDokumentasjon(mellomlager: Mellomlager, endringer: Dokumentasjonsendringer) {
    const lagret = mellomlager.lagret();
    if (!lagret) {
        throw new Error('Det finnes ingen mellomlagret søknad å endre');
    }

    mellomlager.endre({
        søknad: {
            ...lagret.søknad,
            dokumentasjon: lagret.søknad.dokumentasjon.map(dok => ({ ...dok, ...endringer[dok.dokumentasjonsbehov] })),
        },
    });
}

async function gåTilDokumentasjonMedSkriftligAvtale(page: Page) {
    await gåTilSteg(page, Steg.OmBarnet);
    await fyllUtOmBarnet(page);
    await svar(page, SKRIFTLIG_AVTALE_SPØRSMÅL, 'Ja');
    await gåTilNesteSteg(page);
    await forventSteg(page, Steg.Oppsummering);
    await gåTilNesteSteg(page);
    await forventSteg(page, Steg.Dokumentasjon);
}

async function klargjørLagretSøknad(
    page: Page,
    mellomlager: Mellomlager,
    endringer: Dokumentasjonsendringer,
    medSkriftligAvtale = false
) {
    if (medSkriftligAvtale) {
        await gåTilDokumentasjonMedSkriftligAvtale(page);
    } else {
        await gåTilSteg(page, Steg.Dokumentasjon);
    }
    await expect.poll(() => mellomlager.lagret()?.sisteUtfylteStegIndex).toBe(OPPSUMMERING_STEGINDEKS);
    endreMellomlagretDokumentasjon(mellomlager, endringer);
}

async function fortsettLagretSøknad(page: Page) {
    await page.reload();
    await page.getByRole('button', { name: 'Fortsett på søknaden' }).click();
    await forventSteg(page, Steg.Oppsummering);
    await gåTilNesteSteg(page);
    await forventSteg(page, Steg.Dokumentasjon);
}

const dokumentasjonMedVedlegg = (søknad: ISøknadKontrakt, behov: Dokumentasjonsbehov) =>
    søknad.dokumentasjon.find(dok => dok.dokumentasjonsbehov === behov);

test.describe('Dokumentasjon', () => {
    test('søknad uten dokumentasjonskrav har ingen frivillig opplasting og kan sendes', async ({ page }) => {
        await gåTilSteg(page, Steg.Dokumentasjon);

        await expect(page.getByRole('heading', { name: 'Annen dokumentasjon', exact: true })).toHaveCount(0);
        await expect(page.locator('input[type="file"]')).toHaveCount(0);
        await expect(
            page.getByText(/Slik tar du (et|eit) godt bilde|How to take a good picture of the document/)
        ).toHaveCount(0);

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();
        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();

        expect(dokumentasjonMedVedlegg(søknad, Dokumentasjonsbehov.ANNEN_DOKUMENTASJON)).toMatchObject({
            opplastedeVedlegg: [],
        });
    });

    test('gjenopptatt søknad viser og sender tidligere frivillig vedlegg uten ny opplasting', async ({
        page,
        mellomlager,
    }) => {
        const lagretVedlegg = vedlegg('syntetisk-annen-vedlegg', 'tidligere-vedlegg.pdf');
        await klargjørLagretSøknad(page, mellomlager, {
            [Dokumentasjonsbehov.ANNEN_DOKUMENTASJON]: { harSendtInn: true, opplastedeVedlegg: [lagretVedlegg] },
        });

        await fortsettLagretSøknad(page);

        await expect(page.getByRole('heading', { name: 'Annen dokumentasjon', exact: true })).toBeVisible();
        await expect(page.getByText(lagretVedlegg.navn, { exact: true })).toBeVisible();
        await expect(page.locator('input[type="file"]')).toHaveCount(0);
        expect(
            mellomlager
                .lagret()
                ?.søknad.dokumentasjon.find(dok => dok.dokumentasjonsbehov === Dokumentasjonsbehov.ANNEN_DOKUMENTASJON)
        ).toMatchObject({ harSendtInn: true, opplastedeVedlegg: [lagretVedlegg] });

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();
        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();

        expect(dokumentasjonMedVedlegg(søknad, Dokumentasjonsbehov.ANNEN_DOKUMENTASJON)).toMatchObject({
            harSendtInn: true,
            opplastedeVedlegg: [
                {
                    dokumentId: lagretVedlegg.dokumentId,
                    navn: lagretVedlegg.navn,
                    tittel: Dokumentasjonsbehov.ANNEN_DOKUMENTASJON,
                },
            ],
        });
    });

    test('sletting av siste lagrede frivillige vedlegg blir mellomlagret og sendes ikke', async ({
        page,
        mellomlager,
    }) => {
        const lagretVedlegg = vedlegg('syntetisk-slettet-annen-vedlegg', 'slett-meg.pdf');
        await klargjørLagretSøknad(page, mellomlager, {
            [Dokumentasjonsbehov.ANNEN_DOKUMENTASJON]: { harSendtInn: false, opplastedeVedlegg: [lagretVedlegg] },
        });
        await fortsettLagretSøknad(page);

        await page.getByRole('button', { name: 'Slett filen' }).click();
        await expect(page.getByText(lagretVedlegg.navn, { exact: true })).toBeHidden();
        await expect(page.getByRole('heading', { name: 'Annen dokumentasjon', exact: true })).toHaveCount(0);
        await expect
            .poll(
                () =>
                    mellomlager
                        .lagret()
                        ?.søknad.dokumentasjon.find(
                            dok => dok.dokumentasjonsbehov === Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
                        )?.opplastedeVedlegg
            )
            .toEqual([]);

        await fortsettLagretSøknad(page);
        await expect(page.getByText(lagretVedlegg.navn, { exact: true })).toHaveCount(0);
        await expect(page.getByRole('heading', { name: 'Annen dokumentasjon', exact: true })).toHaveCount(0);

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();
        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(dokumentasjonMedVedlegg(søknad, Dokumentasjonsbehov.ANNEN_DOKUMENTASJON)).toMatchObject({
            opplastedeVedlegg: [],
        });
        expect(søknad.dokumentasjon.flatMap(dok => dok.opplastedeVedlegg).map(fil => fil.dokumentId)).not.toContain(
            lagretVedlegg.dokumentId
        );
    });

    test('gjenopptatt søknad med frivillige og etterspurte vedlegg beholder begge kategorier', async ({
        page,
        mellomlager,
    }) => {
        const frivilligVedlegg = vedlegg('syntetisk-blandet-annen', 'frivillig.pdf');
        const etterspurtVedlegg = vedlegg('syntetisk-blandet-avtale', 'avtale.pdf');
        await klargjørLagretSøknad(
            page,
            mellomlager,
            {
                [Dokumentasjonsbehov.ANNEN_DOKUMENTASJON]: {
                    harSendtInn: false,
                    opplastedeVedlegg: [frivilligVedlegg],
                },
                [Dokumentasjonsbehov.AVTALE_DELT_BOSTED]: {
                    harSendtInn: false,
                    opplastedeVedlegg: [etterspurtVedlegg],
                },
            },
            true
        );
        await fortsettLagretSøknad(page);

        await expect(page.getByText(frivilligVedlegg.navn, { exact: true })).toBeVisible();
        await expect(page.getByText(etterspurtVedlegg.navn, { exact: true })).toBeVisible();
        await expect(page.locator('input[type="file"]')).toHaveCount(1);

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();
        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(dokumentasjonMedVedlegg(søknad, Dokumentasjonsbehov.ANNEN_DOKUMENTASJON)?.opplastedeVedlegg).toEqual([
            {
                dokumentId: frivilligVedlegg.dokumentId,
                navn: frivilligVedlegg.navn,
                tittel: Dokumentasjonsbehov.ANNEN_DOKUMENTASJON,
            },
        ]);
        expect(dokumentasjonMedVedlegg(søknad, Dokumentasjonsbehov.AVTALE_DELT_BOSTED)?.opplastedeVedlegg).toEqual([
            {
                dokumentId: etterspurtVedlegg.dokumentId,
                navn: etterspurtVedlegg.navn,
                tittel: Dokumentasjonsbehov.AVTALE_DELT_BOSTED,
            },
        ]);
    });

    test('fjerner vedlegg ved 46-timersgrensen når dokumentasjonssteget monteres', async ({ page, mellomlager }) => {
        const vedleggFørGrensenAnnen = vedlegg(
            'annen-før-grensen',
            'annen-før-grensen.pdf',
            new Date(TIDSPUNKT_FOR_MONTERING.getTime() - TIMER_46 + 1).toISOString()
        );
        const vedleggVedGrensenAnnen = vedlegg(
            'annen-ved-grensen',
            'annen-ved-grensen.pdf',
            new Date(TIDSPUNKT_FOR_MONTERING.getTime() - TIMER_46).toISOString()
        );
        const vedleggEtterGrensenAnnen = vedlegg(
            'annen-etter-grensen',
            'annen-etter-grensen.pdf',
            new Date(TIDSPUNKT_FOR_MONTERING.getTime() - TIMER_46 - 1).toISOString()
        );
        const vedleggFørGrensenAvtale = vedlegg(
            'avtale-før-grensen',
            'avtale-før-grensen.pdf',
            new Date(TIDSPUNKT_FOR_MONTERING.getTime() - TIMER_46 + 1).toISOString()
        );
        const vedleggVedGrensenAvtale = vedlegg(
            'avtale-ved-grensen',
            'avtale-ved-grensen.pdf',
            new Date(TIDSPUNKT_FOR_MONTERING.getTime() - TIMER_46).toISOString()
        );
        const vedleggEtterGrensenAvtale = vedlegg(
            'avtale-etter-grensen',
            'avtale-etter-grensen.pdf',
            new Date(TIDSPUNKT_FOR_MONTERING.getTime() - TIMER_46 - 1).toISOString()
        );
        await klargjørLagretSøknad(
            page,
            mellomlager,
            {
                [Dokumentasjonsbehov.ANNEN_DOKUMENTASJON]: {
                    harSendtInn: false,
                    opplastedeVedlegg: [vedleggFørGrensenAnnen, vedleggVedGrensenAnnen, vedleggEtterGrensenAnnen],
                },
                [Dokumentasjonsbehov.AVTALE_DELT_BOSTED]: {
                    harSendtInn: false,
                    opplastedeVedlegg: [vedleggFørGrensenAvtale, vedleggVedGrensenAvtale, vedleggEtterGrensenAvtale],
                },
            },
            true
        );

        await page.clock.setFixedTime(TIDSPUNKT_FOR_MONTERING);
        await fortsettLagretSøknad(page);

        const vedleggIBehov = (behov: Dokumentasjonsbehov) =>
            mellomlager
                .lagret()
                ?.søknad.dokumentasjon.find(dok => dok.dokumentasjonsbehov === behov)
                ?.opplastedeVedlegg.map(fil => fil.dokumentId);
        await expect
            .poll(() => vedleggIBehov(Dokumentasjonsbehov.ANNEN_DOKUMENTASJON))
            .toEqual([vedleggFørGrensenAnnen.dokumentId]);
        await expect
            .poll(() => vedleggIBehov(Dokumentasjonsbehov.AVTALE_DELT_BOSTED))
            .toEqual([vedleggFørGrensenAvtale.dokumentId]);
        await expect(page.getByText(vedleggVedGrensenAnnen.navn, { exact: true })).toBeVisible();
        await expect(page.getByText(vedleggEtterGrensenAnnen.navn, { exact: true })).toBeVisible();
        await expect(page.getByText(vedleggVedGrensenAvtale.navn, { exact: true })).toBeVisible();
        await expect(page.getByText(vedleggEtterGrensenAvtale.navn, { exact: true })).toBeVisible();
        await expect(page.getByText(vedleggFørGrensenAnnen.navn, { exact: true })).toBeVisible();
        await expect(page.getByText(vedleggFørGrensenAvtale.navn, { exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Slett filen' })).toHaveCount(2);
        await expect(
            page.getByText(
                'Det har gått for lang tid siden du startet på søknaden, og dokumentasjonen du har lastet opp tidligere er ikke lenger lagret hos oss.',
                { exact: true }
            )
        ).toBeVisible();
        await expect(page.getByText('Du må laste opp følgende filer på nytt:', { exact: true })).toBeVisible();

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();
        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(dokumentasjonMedVedlegg(søknad, Dokumentasjonsbehov.ANNEN_DOKUMENTASJON)?.opplastedeVedlegg).toEqual([
            {
                dokumentId: vedleggFørGrensenAnnen.dokumentId,
                navn: vedleggFørGrensenAnnen.navn,
                tittel: Dokumentasjonsbehov.ANNEN_DOKUMENTASJON,
            },
        ]);
        expect(dokumentasjonMedVedlegg(søknad, Dokumentasjonsbehov.AVTALE_DELT_BOSTED)?.opplastedeVedlegg).toEqual([
            {
                dokumentId: vedleggFørGrensenAvtale.dokumentId,
                navn: vedleggFørGrensenAvtale.navn,
                tittel: Dokumentasjonsbehov.AVTALE_DELT_BOSTED,
            },
        ]);
    });

    test('sender opplastet etterspurt vedlegg med riktig dokument-ID og kategori', async ({ page, mellomlager }) => {
        await gåTilDokumentasjonMedSkriftligAvtale(page);

        await lastOppFil(page, PDF);
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeVisible();
        await expect
            .poll(
                () =>
                    mellomlager
                        .lagret()
                        ?.søknad.dokumentasjon.find(
                            dok => dok.dokumentasjonsbehov === Dokumentasjonsbehov.AVTALE_DELT_BOSTED
                        )?.opplastedeVedlegg
            )
            .toHaveLength(1);
        const lagretVedlegg = mellomlager
            .lagret()
            ?.søknad.dokumentasjon.find(dok => dok.dokumentasjonsbehov === Dokumentasjonsbehov.AVTALE_DELT_BOSTED)
            ?.opplastedeVedlegg[0];
        if (!lagretVedlegg) {
            throw new Error('Det etterspurte vedlegget ble ikke mellomlagret');
        }

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();
        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(dokumentasjonMedVedlegg(søknad, Dokumentasjonsbehov.AVTALE_DELT_BOSTED)?.opplastedeVedlegg).toEqual([
            {
                dokumentId: lagretVedlegg.dokumentId,
                navn: PDF.name,
                tittel: Dokumentasjonsbehov.AVTALE_DELT_BOSTED,
            },
        ]);
    });

    test('opplasting og sletting av etterspurt vedlegg fungerer', async ({ page }) => {
        await gåTilDokumentasjonMedSkriftligAvtale(page);

        await lastOppFil(page, PDF);
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeVisible();
        await expect(page.locator('input[type="file"]')).toHaveCount(1);

        await page.getByRole('button', { name: 'Slett filen' }).click();

        await expect(page.getByText(PDF.name, { exact: true })).toBeHidden();
        await expect(page.getByRole('heading', { name: /^Vedlegg/ })).toBeHidden();
        await expect(page.locator('input[type="file"]')).toHaveCount(1);
    });

    test('skal avvise filtyper som ikke støttes for etterspurt dokumentasjon', async ({ page }) => {
        await gåTilDokumentasjonMedSkriftligAvtale(page);

        await lastOppFil(page, { name: 'notat.txt', mimeType: 'text/plain', buffer: Buffer.from('notat') });

        await expect(page.getByRole('heading', { name: 'Vedlegg med feil (1)' })).toBeVisible();
        await expect(page.getByText('Filformatet støttes ikke')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeHidden();
    });

    test('skal vise feil når opplasting av etterspurt dokumentasjon feiler', async ({ page, apiMock }) => {
        apiMock.use(http.post(VEDLEGG_URL, () => new HttpResponse(null, { status: 500 })));
        await gåTilDokumentasjonMedSkriftligAvtale(page);

        await lastOppFil(page, PDF);

        await expect(page.getByRole('heading', { name: 'Vedlegg med feil (1)' })).toBeVisible();
        await expect(page.getByText('Filopplastingen mislyktes på grunn av en ukjent feil. Prøv igjen.')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeHidden();
    });
});
