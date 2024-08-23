import React, { FC } from 'react';

import { Alert, List } from '@navikt/ds-react';

import { dokumentasjonsbehovTilSpråkId } from '../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../typer/kontrakt/dokumentasjon';

import SpråkTekst from './SpråkTekst/SpråkTekst';

interface IVedleggOppsummeringProps {
    vedlegg: {
        skalVises: boolean;
        dokumentasjonsbehov: Dokumentasjonsbehov;
    }[];
}

export const VedleggOppsummering: FC<IVedleggOppsummeringProps> = ({ vedlegg }) => {
    const vedleggSomSkalVises = vedlegg.filter(vedlegg => vedlegg.skalVises);

    return (
        <>
            {vedleggSomSkalVises.length > 0 && (
                <Alert variant="info">
                    Du må legge ved:
                    <List>
                        {vedleggSomSkalVises.map((vedlegg, index) => (
                            <List.Item key={index}>
                                <SpråkTekst
                                    id={dokumentasjonsbehovTilSpråkId(vedlegg.dokumentasjonsbehov)}
                                />
                            </List.Item>
                        ))}
                    </List>
                    Dette laster du opp senere i søknaden.
                </Alert>
            )}
        </>
    );
};
