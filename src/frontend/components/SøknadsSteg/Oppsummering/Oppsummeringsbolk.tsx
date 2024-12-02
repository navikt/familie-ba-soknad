import React, { ReactNode, useEffect, useState } from 'react';

import styled from 'styled-components';

import { FormSummary } from '@navikt/ds-react';
import { ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { ISteg, RouteEnum } from '../../../typer/routes';
import {
    FlettefeltVerdier,
    LocaleRecordBlock,
    LocaleRecordString,
} from '../../../typer/sanity/sanity';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { AppLenke } from '../../Felleskomponenter/AppLenke/AppLenke';
import { SkjemaFeiloppsummering } from '../../Felleskomponenter/SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface IHookReturn {
    valideringErOk: () => boolean;
    validerAlleSynligeFelter: () => void;
    skjema: ISkjema<SkjemaFeltTyper, string>;
}

interface Props {
    tittel: string;
    språkValues?: { [key: string]: string };
    tittelForSanity?: LocaleRecordBlock | LocaleRecordString;
    flettefelter?: FlettefeltVerdier;
    steg?: ISteg;
    skjemaHook: IHookReturn;
    settFeilAnchors?: React.Dispatch<React.SetStateAction<string[]>>;
    children?: ReactNode;
}

const StyledAppLenkeTekst = styled.span`
    && {
        white-space: nowrap;
    }
`;

const Oppsummeringsbolk: React.FC<Props> = ({
    children,
    tittel,
    språkValues,
    tittelForSanity,
    flettefelter,
    steg,
    skjemaHook,
    settFeilAnchors,
}) => {
    const { hentStegNummer } = useSteg();
    const { søknad, tekster, plainTekst } = useApp();
    const { validerAlleSynligeFelter, valideringErOk, skjema } = skjemaHook;
    const [visFeil, settVisFeil] = useState(false);

    const feilOppsummeringId = skjema.skjemanavn + '-feil';

    useEffect(() => {
        // Når felter valideres blir nye synlige, så vi må kjøre denne igjen til vi har validert alt
        validerAlleSynligeFelter();
    }, [søknad, skjema]);

    useEffect(() => {
        visFeil !== !valideringErOk() && settVisFeil(!valideringErOk());
    }, [skjema]);

    useEffect(() => {
        settFeilAnchors &&
            settFeilAnchors(prevState => {
                const utenDetteSkjemaet = prevState.filter(anchor => {
                    return anchor !== feilOppsummeringId;
                });
                return visFeil ? [...utenDetteSkjemaet, feilOppsummeringId] : utenDetteSkjemaet;
            });
    }, [visFeil]);

    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level="3">
                    {steg?.route !== RouteEnum.OmBarnet &&
                        steg?.route !== RouteEnum.EøsForBarn &&
                        `${hentStegNummer(steg?.route ?? RouteEnum.OmDeg)}. `}
                    {tittelForSanity ? (
                        plainTekst(tittelForSanity, flettefelter)
                    ) : (
                        <SpråkTekst id={tittel} values={språkValues} />
                    )}
                </FormSummary.Heading>
                {steg && !visFeil && (
                    <AppLenke steg={steg}>
                        <StyledAppLenkeTekst>
                            {plainTekst(tekster().OPPSUMMERING.endreSvarLenkeTekst)}
                        </StyledAppLenkeTekst>
                    </AppLenke>
                )}
            </FormSummary.Header>
            <FormSummary.Answers>
                {children}
                {visFeil && (
                    <SkjemaFeiloppsummering
                        skjema={skjema}
                        stegMedFeil={steg}
                        id={feilOppsummeringId}
                    />
                )}
            </FormSummary.Answers>
        </FormSummary>
    );
};

export default Oppsummeringsbolk;
