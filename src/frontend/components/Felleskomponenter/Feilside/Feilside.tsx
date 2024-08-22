import React from 'react';

import { useNavigate } from 'react-router-dom';

import { BodyShort, Box, Heading, Link, List, VStack } from '@navikt/ds-react';

import { useSteg } from '../../../context/StegContext';
import InnholdContainer from '../InnholdContainer/InnholdContainer';

import { feilsideTekster } from './feilsideTekster';

export const Feilside: React.FC = () => {
    const navigate = useNavigate();
    const { hentNåværendeSteg, hentForrigeSteg } = useSteg();
    const nåværendeSteg = hentNåværendeSteg();
    const forrigeRoute = hentForrigeSteg();

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
            <VStack marginBlock="16" gap="32">
                {feilsideTekster.map(feilsidetekst => (
                    <Box key={feilsidetekst.locale}>
                        <BodyShort textColor="subtle" spacing>
                            {feilsidetekst.språktekst}
                        </BodyShort>
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
                                {feilsidetekst.venteNoenMinutter.vanligTekst}
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
                            .
                        </BodyShort>
                    </Box>
                ))}
            </VStack>
        </InnholdContainer>
    );
};
