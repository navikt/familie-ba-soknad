import { captureException } from '@nais/apm';
import { byggSuksessRessurs, RessursStatus } from '@navikt/familie-typer';
import { onLanguageSelect } from '@navikt/nav-dekoratoren-moduler';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '../../../../../mocks/node';
import { urlMedBasePath } from '../../../../../mocks/utils';
import { modellMismatchMelding, modellVersjon } from '../../../../common/modellversjon';
import { LocaleType } from '../../../../common/typer/localeType';
import { type AppContext, useAppContext } from '../../../context/AppContext';
import { trackSøknadSendt } from '../../../umami';
import { LesUtLocation, TestProvidere } from '../../../utils/testing';

import Dokumentasjon from './Dokumentasjon';

vi.mock('@nais/apm', () => ({ captureException: vi.fn() }));
vi.mock('../../../umami', () => ({ trackSøknadSendt: vi.fn() }));
vi.mock('../../../utils/mappingTilKontrakt/søknad', () => ({
    dataISøknadKontraktFormat: vi.fn(locale => ({ originalSpråk: locale, kontraktVersjon: 10 })),
}));

const innsendingUrl = urlMedBasePath('api/soknad/v10');
const backendFeilmelding = 'Du har sendt for mange forespørsler. Vent litt og prøv igjen senere.';
const ratebegrensetRespons = () =>
    HttpResponse.json(
        { status: RessursStatus.FEILET, melding: backendFeilmelding },
        { status: 429, headers: { 'Retry-After': '60' } }
    );
const generiskFeilRespons = () =>
    HttpResponse.json(
        { status: RessursStatus.FEILET, frontendFeilmelding: 'Intern feil fra serveren' },
        { status: 500 }
    );

function velgSpråk(locale: LocaleType) {
    const callback = vi.mocked(onLanguageSelect).mock.calls[0][0];
    act(() => callback({ locale, handleInApp: true }));
}

async function renderDokumentasjon(locale = LocaleType.nb) {
    let app!: AppContext;
    function LesAppContext() {
        app = useAppContext();
        return null;
    }

    const innhold = (visDokumentasjon = true) => (
        <TestProvidere mocketNettleserHistorikk={['/dokumentasjon']}>
            <LesAppContext />
            <LesUtLocation />
            {visDokumentasjon && <Dokumentasjon />}
        </TestProvidere>
    );
    const { rerender } = render(innhold());
    await waitFor(() => expect(app.sluttbruker.status).toBe(RessursStatus.SUKSESS));
    act(() => app.settSøknad(søknad => ({ ...søknad, dokumentasjon: [] })));
    velgSpråk(locale);

    return {
        hentApp: () => app,
        remonterDokumentasjon: () => {
            rerender(innhold(false));
            rerender(innhold());
        },
    };
}

beforeEach(() => {
    server.use(
        http.post(urlMedBasePath('dokument/soknad/barnetrygd'), () => HttpResponse.json(byggSuksessRessurs({})))
    );
});

describe('Dokumentasjon – feil ved innsending', () => {
    it.each([
        [LocaleType.nb, 'Du har sendt for mange forespørsler. Vent litt og prøv igjen senere.'],
        [LocaleType.nn, 'Du har sendt for mange førespurnader. Vent litt og prøv igjen seinare.'],
        [LocaleType.en, 'You have sent too many requests. Please wait a while and try again later.'],
    ])('viser lokaliserte råd ved HTTP 429 på %s via den faktiske innsendingsflyten', async (locale, melding) => {
        const sendInn = vi.fn(ratebegrensetRespons);
        server.use(http.post(innsendingUrl, sendInn));
        const { hentApp } = await renderDokumentasjon(locale);

        fireEvent.click(screen.getByTestId('neste-steg'));

        expect(await screen.findByRole('alert')).toHaveTextContent(melding);
        expect(hentApp().innsendingStatus).toMatchObject({ status: RessursStatus.FEILET, erRatebegrenset: true });
        expect(screen.getByTestId('location')).toHaveTextContent('/dokumentasjon');
        expect(screen.getByTestId('neste-steg')).toBeEnabled();
        expect(sendInn).toHaveBeenCalledTimes(1);
        expect(trackSøknadSendt).not.toHaveBeenCalled();
        expect(captureException).not.toHaveBeenCalled();
    });

    it('beholder ratebegrensningen ved remontering og oversetter ved språkbytte uten ny innsending', async () => {
        const sendInn = vi.fn(ratebegrensetRespons);
        server.use(http.post(innsendingUrl, sendInn));
        const { remonterDokumentasjon } = await renderDokumentasjon();

        fireEvent.click(screen.getByTestId('neste-steg'));
        expect(await screen.findByRole('alert')).toHaveTextContent(backendFeilmelding);

        remonterDokumentasjon();
        velgSpråk(LocaleType.en);

        expect(screen.getByRole('alert')).toHaveTextContent(
            'You have sent too many requests. Please wait a while and try again later.'
        );
        expect(sendInn).toHaveBeenCalledTimes(1);
    });

    it('gjenkjenner HTTP 429 også uten responsinnhold eller Retry-After', async () => {
        server.use(http.post(innsendingUrl, () => new HttpResponse(null, { status: 429 })));
        await renderDokumentasjon(LocaleType.nn);

        fireEvent.click(screen.getByTestId('neste-steg'));

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Du har sendt for mange førespurnader. Vent litt og prøv igjen seinare.'
        );
    });

    it.each([
        ['HTTP 500', generiskFeilRespons],
        ['nettverksfeil', () => HttpResponse.error()],
    ])('beholder den generiske Sanity-feilmeldingen ved %s', async (_navn, respons) => {
        server.use(http.post(innsendingUrl, respons));
        const { hentApp } = await renderDokumentasjon();

        fireEvent.click(screen.getByTestId('neste-steg'));

        expect(await screen.findByRole('alert')).toHaveTextContent('default block');
        expect(hentApp().innsendingStatus.erRatebegrenset).toBeUndefined();
        expect(captureException).toHaveBeenCalled();
        expect(trackSøknadSendt).not.toHaveBeenCalled();
    });

    it('nullstiller ratebegrensningen ved manuelt nytt forsøk og beholder vanlig feil- og suksesshåndtering', async () => {
        const sendInn = vi
            .fn()
            .mockImplementationOnce(ratebegrensetRespons)
            .mockImplementationOnce(generiskFeilRespons)
            .mockImplementationOnce(() =>
                HttpResponse.json(byggSuksessRessurs({ tekst: 'Mottatt', mottattDato: new Date().toISOString() }))
            );
        server.use(http.post(innsendingUrl, sendInn));
        const { hentApp } = await renderDokumentasjon();

        fireEvent.click(screen.getByTestId('neste-steg'));
        expect(await screen.findByRole('alert')).toHaveTextContent(backendFeilmelding);

        fireEvent.click(screen.getByTestId('neste-steg'));
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(hentApp().innsendingStatus).toEqual({ status: RessursStatus.HENTER });
        expect(await screen.findByRole('alert')).toHaveTextContent('default block');
        expect(hentApp().innsendingStatus.erRatebegrenset).toBeUndefined();

        fireEvent.click(screen.getByTestId('neste-steg'));
        await waitFor(() => expect(hentApp().innsendingStatus.status).toBe(RessursStatus.SUKSESS));

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(hentApp().innsendingStatus.erRatebegrenset).toBeUndefined();
        await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/kvittering'));
        expect(trackSøknadSendt).toHaveBeenCalledTimes(1);
        expect(sendInn).toHaveBeenCalledTimes(3);
    });

    it('beholder håndteringen av utdatert modellversjon', async () => {
        server.use(
            http.post(innsendingUrl, () =>
                HttpResponse.json(
                    {
                        status: RessursStatus.FEILET,
                        melding: modellMismatchMelding,
                        data: { modellVersjon: modellVersjon + 1 },
                    },
                    { status: 409 }
                )
            )
        );
        const { hentApp } = await renderDokumentasjon();

        fireEvent.click(screen.getByTestId('neste-steg'));

        await waitFor(() => expect(hentApp().modellVersjonOppdatert).toBe(true));
        expect(hentApp().innsendingStatus.erRatebegrenset).toBeUndefined();
        expect(captureException).not.toHaveBeenCalled();
        expect(trackSøknadSendt).not.toHaveBeenCalled();
    });
});
