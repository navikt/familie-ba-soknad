import React, { FC } from 'react';

import { Alert, List } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import { dokumentasjonsbehovTilSpråkId } from '../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../typer/kontrakt/dokumentasjon';
import { FlettefeltVerdier } from '../../typer/sanity/sanity';

import SpråkTekst from './SpråkTekst/SpråkTekst';

interface IVedleggOppsummeringProps {
    vedlegg: {
        skalVises: boolean;
        dokumentasjonsbehov: Dokumentasjonsbehov;
        flettefeltVerider?: FlettefeltVerdier;
    }[];
}

export const VedleggOppsummering: FC<IVedleggOppsummeringProps> = ({ vedlegg }) => {
    const { tekster, plainTekst } = useApp();

    const dokumentasjonTekster = tekster().DOKUMENTASJON;

    const vedleggSomSkalVises = vedlegg.filter(vedlegg => vedlegg.skalVises);

    return (
        <>
            {vedleggSomSkalVises.length > 0 && (
                <Alert variant="info">
                    {plainTekst(dokumentasjonTekster.lastOppSenereISoknad)}
                    <List>
                        {vedleggSomSkalVises.map((vedlegg, index) => (
                            <List.Item key={index}>
                                <SpråkTekst
                                    id={dokumentasjonsbehovTilSpråkId(vedlegg.dokumentasjonsbehov)}
                                    values={{ barn: vedlegg.flettefeltVerider?.barnetsNavn }}
                                />
                            </List.Item>
                        ))}
                    </List>
                </Alert>
            )}
        </>
    );
};
