import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { Dokumentasjonsbehov, IDokumentasjon } from '../../../typer/dokumentasjon';
import { ESivilstand, ISøker } from '../../../typer/person';
import { ESøknadstype } from '../../../typer/søknad';
import { mockEøs, silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import LastOppVedlegg from './LastOppVedlegg';

const hentAnnenDokumentasjon = (): IDokumentasjon => {
    jest.resetModules();
    const { initialStateSøknad } = jest.requireActual('../../../typer/søknad');

    const dokumentasjon = initialStateSøknad.dokumentasjon.find(
        dok => dok.dokumentasjonsbehov === Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
    );

    if (dokumentasjon === undefined) {
        throw new Error('Fant ikke dokumentasjonsbehov ANNEN_DOKUMENTASJON');
    }
    return dokumentasjon;
};

// Fra initialState generator
const tittelSpråkId = 'dokumentasjon.annendokumentasjon.vedleggtittel';
const beskrivelseSpråkId = 'dokumentasjon.annendokumentasjon.utvidet.informasjon';

describe('LastOppVedlegg', () => {
    beforeEach(() => {
        silenceConsoleErrors();
        jest.resetModules();
        mockEøs();
    });

    it('Viser ikke info-tekst og checkbox knapp for ANNEN_DOKUMENTASJON', () => {
        spyOnUseApp({});
        const dokumentasjon = hentAnnenDokumentasjon();

        const { getByText, queryByText } = render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} vedleggNr={1} />
            </TestProvidere>
        );

        const tittel = getByText(tittelSpråkId);
        expect(tittel).toBeInTheDocument();
        const infoTekst: HTMLElement | null = queryByText(beskrivelseSpråkId);
        expect(infoTekst).toBeNull();
        const checkBoxTitle: HTMLElement | null = queryByText('dokumentasjon.har-sendt-inn.spm');
        expect(checkBoxTitle).toBeNull();
    });

    it('Viser info-tekst og checkbox knapp for ANNEN_DOKUMENTASJON når utvidet og skilt', () => {
        const søker = mockDeep<ISøker>({
            sivilstand: {
                type: ESivilstand.SKILT,
            },
        });
        spyOnUseApp({ søker, søknadstype: ESøknadstype.UTVIDET });

        jest.spyOn(window, 'location', 'get').mockReturnValue({
            ...window.location,
            pathname: '/utvidet/',
        });

        return import('../../../typer/søknad').then(() => {
            const dokumentasjon = hentAnnenDokumentasjon();

            const { getByText, queryByText } = render(
                <TestProvidere>
                    <LastOppVedlegg dokumentasjon={dokumentasjon} vedleggNr={1} />
                </TestProvidere>
            );

            const tittel = getByText(tittelSpråkId);
            expect(tittel).toBeInTheDocument();
            const infoTekst: HTMLElement | null = queryByText(beskrivelseSpråkId);
            expect(infoTekst).not.toBeNull();
            const checkBoxTitle: HTMLElement | null = queryByText(
                'dokumentasjon.har-sendt-inn.spm'
            );
            expect(checkBoxTitle).toBeNull();
        });
    });
});
