import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { vi } from 'vitest';

import { Dokumentasjonsbehov } from '../../../../common/typer/kontrakt/dokumentasjon';
import { BeskrivelseSanityApiNavn, type IDokumentasjon, type IVedlegg } from '../../../typer/dokumentasjon';
import type { IBarn } from '../../../typer/person';
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

const sendtInnTidligere = /^DOKUMENTASJON\.sendtInnTidligere/;
const velgFiler = 'DOKUMENTASJON.velgFiler';
const slettFil = 'DOKUMENTASJON.slettFilen';

const ControlledLastOppVedlegg = ({ dokumentasjon }: { dokumentasjon: IDokumentasjon }) => {
    const [gjeldendeDokumentasjon, settGjeldendeDokumentasjon] = useState(dokumentasjon);

    return (
        <LastOppVedlegg
            dokumentasjon={gjeldendeDokumentasjon}
            oppdaterDokumentasjon={(_, opplastedeVedlegg, harSendtInn) =>
                settGjeldendeDokumentasjon(prev => ({ ...prev, opplastedeVedlegg, harSendtInn }))
            }
        />
    );
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

        render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={vi.fn()} />
            </TestProvidere>
        );

        expect(screen.getByText('beredskapshjem-beskrivelse')).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: sendtInnTidligere })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: velgFiler })).toBeInTheDocument();
    });

    it('viser ingen seksjon for tom ANNEN_DOKUMENTASJON', () => {
        spyOnUseApp({});
        const dokumentasjon = hentAnnenDokumentasjon();

        const { container } = render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={vi.fn()} />
            </TestProvidere>
        );

        expect(screen.queryByRole('checkbox', { name: sendtInnTidligere })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: velgFiler })).not.toBeInTheDocument();
        expect(container.querySelector('input[type="file"]')).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });

    it.each([false, true])('viser lagret ANNEN_DOKUMENTASJON uten opplasting når harSendtInn er %s', harSendtInn => {
        spyOnUseApp({});
        const dokumentasjon: IDokumentasjon = {
            ...hentAnnenDokumentasjon(),
            beskrivelseSanityApiNavn: BeskrivelseSanityApiNavn.annenDokumentasjonBeskrivelse,
            harSendtInn,
            opplastedeVedlegg: [
                {
                    dokumentId: 'dokument-id',
                    navn: 'eksisterende.pdf',
                    størrelse: 1234,
                    tidspunkt: '2025-01-01T00:00:00.000Z',
                },
            ],
        };

        const { container } = render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={vi.fn()} />
            </TestProvidere>
        );

        expect(screen.getByRole('heading', { name: 'DOKUMENTASJON.annenDokumentasjon' })).toBeInTheDocument();
        expect(screen.getByText('eksisterende.pdf')).toBeInTheDocument();
        expect(screen.queryByText('DOKUMENTASJON.annenDokumentasjonBeskrivelse')).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', { name: sendtInnTidligere })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: velgFiler })).not.toBeInTheDocument();
        expect(container.querySelector('input[type="file"]')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: slettFil })).toBeInTheDocument();
    });

    it('fjerner seksjonen når siste lagrede ANNEN_DOKUMENTASJON-vedlegg slettes', () => {
        spyOnUseApp({});
        const vedlegg: IVedlegg = {
            dokumentId: 'dokument-id',
            navn: 'eksisterende.pdf',
            størrelse: 1234,
            tidspunkt: '2025-01-01T00:00:00.000Z',
        };

        render(
            <TestProvidere>
                <ControlledLastOppVedlegg
                    dokumentasjon={{
                        ...hentAnnenDokumentasjon(),
                        harSendtInn: true,
                        opplastedeVedlegg: [vedlegg],
                    }}
                />
            </TestProvidere>
        );

        expect(screen.getByText('eksisterende.pdf')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: slettFil }));
        expect(screen.queryByText('eksisterende.pdf')).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'DOKUMENTASJON.annenDokumentasjon' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: velgFiler })).not.toBeInTheDocument();
    });

    it('skjuler filinput og markerer tidligere innsendt for etterspurt dokumentasjon', () => {
        spyOnUseApp({});
        const dokumentasjon: IDokumentasjon = {
            dokumentasjonsbehov: Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN,
            gjelderForBarnId: [],
            gjelderForSøker: false,
            harSendtInn: true,
            opplastedeVedlegg: [],
        };

        const { container } = render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={vi.fn()} />
            </TestProvidere>
        );

        expect(screen.getByRole('checkbox', { name: sendtInnTidligere })).toBeChecked();
        expect(container.querySelector('input[type="file"]')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: velgFiler })).not.toBeInTheDocument();
    });
});
