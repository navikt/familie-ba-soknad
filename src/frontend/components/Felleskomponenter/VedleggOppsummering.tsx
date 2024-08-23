import React, { FC } from 'react';

import { Alert, List } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { dokumentasjonsbehovTilSpråkId } from '../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../typer/kontrakt/dokumentasjon';

import SpråkTekst from './SpråkTekst/SpråkTekst';

interface IVedleggOppsummeringProps {
    vedleggSvarOgDokumentasjonsbehov: {
        svar: ESvar | null;
        dokumentasjonsbehov: Dokumentasjonsbehov;
    }[];
}

export const VedleggOppsummering: FC<IVedleggOppsummeringProps> = ({
    vedleggSvarOgDokumentasjonsbehov,
}) => {
    return (
        <Alert variant="info">
            Du må legge ved:
            <List>
                {vedleggSvarOgDokumentasjonsbehov
                    .filter(
                        vedleggSvarOgDokumentasjonsbehov =>
                            vedleggSvarOgDokumentasjonsbehov &&
                            vedleggSvarOgDokumentasjonsbehov.svar === ESvar.JA
                    )
                    .map((vedleggSvarOgDokumentasjon, index) => (
                        <List.Item key={index}>
                            <SpråkTekst
                                id={dokumentasjonsbehovTilSpråkId(
                                    vedleggSvarOgDokumentasjon.dokumentasjonsbehov
                                )}
                            />
                        </List.Item>
                    ))}
            </List>
            Dette laster du opp senere i søknaden.
        </Alert>
    );
};
