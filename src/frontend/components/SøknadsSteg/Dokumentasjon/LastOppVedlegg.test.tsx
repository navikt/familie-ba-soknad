import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { Dokumentasjonsbehov } from '../../../../common/typer/kontrakt/dokumentasjon';
import { ESivilstand, ESøknadstype } from '../../../../common/typer/kontrakt/generelle';
import { BeskrivelseSanityApiNavn, type IDokumentasjon } from '../../../typer/dokumentasjon';
import type { IBarn, ISøker } from '../../../typer/person';
import { initialStateSøknad } from '../../../typer/søknad';
import { genererInitialBarnMedISøknad } from '../../../utils/barn';
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
    it('viser beredskapshjemtekst når bekreftelse fra barnevernet gjelder et barn i beredskapshjem', () => {
        const barnFraPdl: IBarn = {
            id: 'barn-id',
            navn: 'Barn Barnesen',
            ident: '12345678910',
            borMedSøker: true,
            alder: null,
            adressebeskyttelse: false,
        };
        const barn = genererInitialBarnMedISøknad(barnFraPdl);
        const dokumentasjon: IDokumentasjon = {
            dokumentasjonsbehov: Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN,
            beskrivelseSanityApiNavn: BeskrivelseSanityApiNavn.bekreftelseFraBarnevernetBeredskapshjemBarnetrygd,
            gjelderForBarnId: [barn.id],
            gjelderForSøker: false,
            harSendtInn: false,
            opplastedeVedlegg: [],
        };
        spyOnUseApp({ barnInkludertISøknaden: [barn] });

        const { getByText } = render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={vi.fn()} />
            </TestProvidere>
        );

        expect(getByText('beredskapshjem-beskrivelse')).toBeInTheDocument();
    });

    it('Viser ikke info-tekst og checkbox knapp for ANNEN_DOKUMENTASJON', () => {
        spyOnUseApp({});
        const dokumentasjon = hentAnnenDokumentasjon();
        const oppdaterDokumentasjon = vi.fn();

        const { getByTestId, queryByTestId } = render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={oppdaterDokumentasjon} />
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
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={oppdaterDokumentasjon} />
            </TestProvidere>
        );

        expect(queryByTestId('dokumentasjon-er-sendt-inn-checkboks')).not.toBeInTheDocument();
        expect(queryByTestId('dokumentasjonsbeskrivelse')).not.toBeInTheDocument();
        expect(getByTestId('dokumentopplaster')).toBeInTheDocument();
    });
});
