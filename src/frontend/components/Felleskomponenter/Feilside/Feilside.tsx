import React from 'react';

import { useNavigate } from 'react-router-dom';

import { BodyShort, Box, Heading, Link, List } from '@navikt/ds-react';

import { useSteg } from '../../../context/StegContext';
import InnholdContainer from '../InnholdContainer/InnholdContainer';

import useFeilsideTekster from './useFeilsideTekster';

export const Feilside: React.FC = () => {
    const navigate = useNavigate();
    const { hentNåværendeSteg, hentForrigeSteg } = useSteg();
    const nåværendeSteg = hentNåværendeSteg();
    const forrigeRoute = hentForrigeSteg();
    const feilsidetekster = useFeilsideTekster();

    const håndterLastSidenPåNytt = () => {
        location.reload();
    };

    const håndterTilbake = () => {
        navigate(forrigeRoute.path);
    };

    // TODO: Er det mulig å få andre statuskoder enn 500? Hvis ja, hvordan finner vi dem og viser det her på feilsiden?
    const statuskode = '500';

    return (
        <InnholdContainer>
            <Box marginBlock="32">
                <BodyShort textColor="subtle" size="small">
                    {feilsidetekster.statuskode} {statuskode}
                </BodyShort>
                <Heading level="1" size="large" spacing>
                    {feilsidetekster.tittel}
                </Heading>
                <BodyShort spacing>{feilsidetekster.beskrivelse}</BodyShort>
                <BodyShort>{feilsidetekster.duKanPrøveÅ}</BodyShort>
                <List>
                    <List.Item>
                        {feilsidetekster.venteNoenMinutter.vanligTekst}{' '}
                        <Link
                            href={nåværendeSteg.path}
                            variant="action"
                            onClick={event => {
                                event.preventDefault();
                                håndterLastSidenPåNytt();
                            }}
                        >
                            {feilsidetekster.venteNoenMinutter.lenkeTekst}
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
                            {feilsidetekster.gåTilbakeTilForrigeSide}
                        </Link>
                    </List.Item>
                </List>
                <BodyShort>
                    {feilsidetekster.hvisProblemetVedvarer.vanligTekst}
                    <Link href="https://nav.no/kontaktoss" target="_blank">
                        {feilsidetekster.hvisProblemetVedvarer.lenkeTekst}
                    </Link>
                    .
                </BodyShort>
            </Box>
        </InnholdContainer>
    );
};
