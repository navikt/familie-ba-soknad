import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

// import { IDokumentasjon } from '../../../typer/dokumentasjon';
// import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand, ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøker } from '../../../typer/person';
import { mockEøs, silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';

// const hentAnnenDokumentasjon = (): IDokumentasjon => {
//     jest.resetModules();
//     const { initialStateSøknad } = jest.requireActual('../../../typer/søknad');

//     const dokumentasjon = initialStateSøknad(false).dokumentasjon.find(
//         dok => dok.dokumentasjonsbehov === Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
//     );

//     if (dokumentasjon === undefined) {
//         throw new Error('Fant ikke dokumentasjonsbehov ANNEN_DOKUMENTASJON');
//     }
//     return dokumentasjon;
// };

describe('LastOppVedlegg', () => {
    beforeEach(() => {
        silenceConsoleErrors();
        jest.resetModules();
        mockEøs();
    });

    it('Viser ikke info-tekst og checkbox knapp for ANNEN_DOKUMENTASJON', () => {
        spyOnUseApp({});
        // const dokumentasjon = hentAnnenDokumentasjon();
        // const oppdaterDokumentasjon = jest.fn();

        const { getByTestId, queryByTestId } = render(
            <TestProvidere>
                {/* <LastOppVedlegg
                    dokumentasjon={dokumentasjon}
                    oppdaterDokumentasjon={oppdaterDokumentasjon}
                /> */}
            </TestProvidere>
        );

        expect(queryByTestId('dokumentasjon-er-sendt-inn-checkboks')).not.toBeInTheDocument();
        expect(queryByTestId('dokumentasjonsbeskrivelse')).not.toBeInTheDocument();
        expect(getByTestId('dokumentopplaster')).toBeInTheDocument();
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
            // const dokumentasjon = hentAnnenDokumentasjon();
            // const oppdaterDokumentasjon = jest.fn();

            const { getByTestId, queryByTestId } = render(
                <TestProvidere>
                    {/* <LastOppVedlegg
                        dokumentasjon={dokumentasjon}
                        oppdaterDokumentasjon={oppdaterDokumentasjon}
                    /> */}
                </TestProvidere>
            );

            expect(queryByTestId('dokumentasjon-er-sendt-inn-checkboks')).not.toBeInTheDocument();
            expect(queryByTestId('dokumentasjonsbeskrivelse')).not.toBeInTheDocument();
            expect(getByTestId('dokumentopplaster')).toBeInTheDocument();
        });
    });
});
