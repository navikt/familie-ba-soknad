import React from 'react';

import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { IDokumentasjon } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand, ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ISøker } from '../../../typer/person';
import { initialStateSøknad } from '../../../typer/søknad';
import { spyOnUseApp, TestProvidere } from '../../../utils/testing';

import LastOppVedlegg from './LastOppVedlegg';

const hentAnnenDokumentasjon = (): IDokumentasjon => {
    const søknad = initialStateSøknad();

    const dokumentasjon = søknad.dokumentasjon.find(
        dok => dok.dokumentasjonsbehov === Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
    );

    if (dokumentasjon === undefined) {
        throw new Error('Fant ikke dokumentasjonsbehov ANNEN_DOKUMENTASJON');
    }
    return dokumentasjon;
};

describe('LastOppVedlegg', () => {
    it('Viser ikke info-tekst og checkbox knapp for ANNEN_DOKUMENTASJON', () => {
        spyOnUseApp({});
        const dokumentasjon = hentAnnenDokumentasjon();
        const oppdaterDokumentasjon = vi.fn();

        const { getByTestId, queryByTestId } = render(
            <TestProvidere>
                <LastOppVedlegg
                    dokumentasjon={dokumentasjon}
                    oppdaterDokumentasjon={oppdaterDokumentasjon}
                />
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

        const dokumentasjon = hentAnnenDokumentasjon();
        const oppdaterDokumentasjon = vi.fn();

        const { getByTestId, queryByTestId } = render(
            <TestProvidere mocketNettleserHistorikk={['/utvidet/']}>
                <LastOppVedlegg
                    dokumentasjon={dokumentasjon}
                    oppdaterDokumentasjon={oppdaterDokumentasjon}
                />
            </TestProvidere>
        );

        expect(queryByTestId('dokumentasjon-er-sendt-inn-checkboks')).not.toBeInTheDocument();
        expect(queryByTestId('dokumentasjonsbeskrivelse')).not.toBeInTheDocument();
        expect(getByTestId('dokumentopplaster')).toBeInTheDocument();
    });
});
