import React from 'react';

import { useNavigate } from 'react-router-dom';

import { BodyShort, Heading, Link, List } from '@navikt/ds-react';

import { useSpråk } from '../../../context/SpråkContext';
import { useSteg } from '../../../context/StegContext';
import { LocaleType } from '../../../typer/common';
import InnholdContainer from '../InnholdContainer/InnholdContainer';

interface FeilsideTekst {
    statuskode: string;
    tittel: string;
    beskrivelse: string;
    duKanPrøveÅ: string;
    venteNoenMinutter: {
        vanligTekst: string;
        lenkeTekst: string;
    };
    gåTilbakeTilForrigeSide: string;
    hvisProblemetVedvarer: {
        vanligTekst: string;
        lenkeTekst: string;
    };
}

type FeilsideTekster = Record<LocaleType, FeilsideTekst>;

const feilsideTekster: FeilsideTekster = {
    nb: {
        statuskode: 'Statuskode',
        tittel: 'Beklager, noe gikk galt',
        beskrivelse:
            'En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe du gjorde.',
        duKanPrøveÅ: 'Du kan prøve å',
        venteNoenMinutter: {
            vanligTekst: 'vente noen minutter og ',
            lenkeTekst: 'laste siden på nytt',
        },
        gåTilbakeTilForrigeSide: 'gå tilbake til forrige side',
        hvisProblemetVedvarer: {
            vanligTekst: 'Hvis problemet vedvarer, kan du ',
            lenkeTekst: 'kan du kontakte oss (åpnes i ny fane)',
        },
    },
    nn: {
        statuskode: 'Statuskode',
        tittel: 'Beklager, noe gikk galt',
        beskrivelse:
            'En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe du gjorde.',
        duKanPrøveÅ: 'Du kan prøve å',
        venteNoenMinutter: {
            vanligTekst: 'vente noen minutter og',
            lenkeTekst: 'laste siden på nytt',
        },
        gåTilbakeTilForrigeSide: 'gå tilbake til forrige side',
        hvisProblemetVedvarer: {
            vanligTekst: 'Hvis problemet vedvarer, kan du ',
            lenkeTekst: 'kan du kontakte oss (åpnes i ny fane)',
        },
    },
    en: {
        statuskode: 'Statuskode',
        tittel: 'Beklager, noe gikk galt',
        beskrivelse:
            'En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe du gjorde.',
        duKanPrøveÅ: 'Du kan prøve å',
        venteNoenMinutter: {
            vanligTekst: 'vente noen minutter og',
            lenkeTekst: 'laste siden på nytt',
        },
        gåTilbakeTilForrigeSide: 'gå tilbake til forrige side',
        hvisProblemetVedvarer: {
            vanligTekst: 'Hvis problemet vedvarer, kan du ',
            lenkeTekst: 'kan du kontakte oss (åpnes i ny fane).',
        },
    },
};

const useFeilsideTekst = (): FeilsideTekst => {
    const { valgtLocale } = useSpråk();
    return feilsideTekster[valgtLocale];
};

export const Feilside: React.FC = () => {
    const navigate = useNavigate();
    const { hentNåværendeSteg, hentForrigeSteg } = useSteg();
    const nåværendeSteg = hentNåværendeSteg();
    const forrigeRoute = hentForrigeSteg();
    const feilsidetekst = useFeilsideTekst();

    const håndterLastSidenPåNytt = () => {
        location.reload();
    };

    const håndterTilbake = () => {
        navigate(forrigeRoute.path);
    };

    const statuskode = '500';

    return (
        <InnholdContainer>
            <BodyShort textColor="subtle" size="small">
                {feilsidetekst.statuskode} {statuskode}
            </BodyShort>
            <Heading level="1" size="large" spacing>
                {feilsidetekst.tittel}
            </Heading>
            <BodyShort spacing>{feilsidetekst.beskrivelse}</BodyShort>
            <BodyShort>{feilsidetekst.duKanPrøveÅ}</BodyShort>
            <List>
                <List.Item>
                    {feilsidetekst.venteNoenMinutter.vanligTekst}{' '}
                    <Link
                        href={nåværendeSteg.path}
                        variant="action"
                        onClick={event => {
                            event.preventDefault();
                            håndterLastSidenPåNytt();
                        }}
                    >
                        {feilsidetekst.venteNoenMinutter.lenkeTekst}
                    </Link>
                </List.Item>
                <List.Item>
                    <Link
                        href={forrigeRoute.path}
                        variant="action"
                        onClick={event => {
                            event.preventDefault();
                            håndterTilbake();
                        }}
                    >
                        {feilsidetekst.gåTilbakeTilForrigeSide}
                    </Link>
                </List.Item>
            </List>
            <BodyShort>
                {feilsidetekst.hvisProblemetVedvarer.vanligTekst}
                <Link href="https://nav.no/kontaktoss" target="_blank">
                    {feilsidetekst.hvisProblemetVedvarer.lenkeTekst}
                </Link>
            </BodyShort>
        </InnholdContainer>
    );
};
