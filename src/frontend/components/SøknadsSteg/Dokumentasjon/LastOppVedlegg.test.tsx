import React from 'react';

import { render } from '@testing-library/react';

import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import { RoutesProvider } from '../../../context/RoutesContext';
import { Dokumentasjonsbehov, IDokumentasjon } from '../../../typer/dokumentasjon';
import { silenceConsoleErrors, spyOnUseApp } from '../../../utils/testing';
import LastOppVedlegg from './LastOppVedlegg';

const hentAnnenDokumentasjon = (): IDokumentasjon => {
    jest.resetModules();
    const { initialStateSøknad } = jest.requireActual('../../../typer/søknad');

    const dokumentasjon = initialStateSøknad.dokumentasjon.find(
        dok => dok.dokumentasjonsbehov === Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
    );

    if (dokumentasjon === undefined) {
        throw new Error("Fant ikke dokumentasjonsbehov ANNEN_DOKUMENTASJON");
    }
    return dokumentasjon;
}

// Fra initialState generator
const tittelSpråkId = 'dokumentasjon.annendokumentasjon.vedleggtittel';
const beskrivelseSpråkId = 'dokumentasjon.annendokumentasjon.utvidet.informasjon';

describe('LastOppVedlegg', () => {
    beforeEach( () => {
        silenceConsoleErrors();
    });
    
    it('Viser ikke info-tekst og checkbox knapp for ANNEN_DOKUMENTASJON', () => {
        spyOnUseApp({});
        const dokumentasjon = hentAnnenDokumentasjon();

        const { getByText, queryByText } = render(
            <SprakProvider tekster={{}} defaultLocale={LocaleType.nb}>
                <HttpProvider>
                    <RoutesProvider>
                        <LastOppVedlegg dokumentasjon={dokumentasjon} vedleggNr={1} />
                    </RoutesProvider>
                </HttpProvider>
            </SprakProvider>
        );

        const tittel = getByText(tittelSpråkId);
        expect(tittel).toBeInTheDocument();
        const infoTekst: HTMLElement | null = queryByText(beskrivelseSpråkId);
        expect(infoTekst).toBeNull();
        const checkBoxTitle: HTMLElement | null = queryByText('dokumentasjon.har-sendt-inn.spm');
        expect(checkBoxTitle).toBeNull();
    });

    it('Viser info-tekst og checkbox knapp for ANNEN_DOKUMENTASJON når utvidet', () => {
        spyOnUseApp({});
        window.location = {
            ...window.location,
            pathname: '/utvidet/'
        };

        const dokumentasjon = hentAnnenDokumentasjon();

        const { getByText, queryByText } = render(
            <SprakProvider tekster={{}} defaultLocale={LocaleType.nb}>
                <HttpProvider>
                    <RoutesProvider>
                        <LastOppVedlegg dokumentasjon={dokumentasjon} vedleggNr={1} />
                    </RoutesProvider>
                </HttpProvider>
            </SprakProvider>
        );

        const tittel = getByText(tittelSpråkId);
        expect(tittel).toBeInTheDocument();
        const infoTekst: HTMLElement | null = queryByText(beskrivelseSpråkId);
        expect(infoTekst).not.toBeNull();
        const checkBoxTitle: HTMLElement | null = queryByText('dokumentasjon.har-sendt-inn.spm');
        expect(checkBoxTitle).toBeNull();
    });
});
