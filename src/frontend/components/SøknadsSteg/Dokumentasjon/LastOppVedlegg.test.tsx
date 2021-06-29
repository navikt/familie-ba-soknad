import React from 'react';

import { render } from '@testing-library/react';

import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import { RoutesProvider } from '../../../context/RoutesContext';
import { Dokumentasjonsbehov, IDokumentasjon } from '../../../typer/dokumentasjon';
import { silenceConsoleErrors, spyOnUseApp } from '../../../utils/testing';
import LastOppVedlegg from './LastOppVedlegg';

silenceConsoleErrors();

describe('LastOppVedlegg', () => {
    it('Viser ikke info-tekst og checkbox knapp for ANNEN_DOKUMENTASJON', () => {
        spyOnUseApp({});

        const tittelSpråkId = 'id på tittel for ANNEN_DOKUMENTASJON';
        const beskrivelseSpråkId = 'id på beskrivelse for ANNEN_DOKUMENTASJON';
        const dokumentasjon: IDokumentasjon = {
            dokumentasjonsbehov: Dokumentasjonsbehov.ANNEN_DOKUMENTASJON,
            gjelderForBarnId: [],
            gjelderForSøker: false,
            harSendtInn: false,
            opplastedeVedlegg: [],
            tittelSpråkId: tittelSpråkId,
            beskrivelseSpråkId: beskrivelseSpråkId,
        };
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
});
