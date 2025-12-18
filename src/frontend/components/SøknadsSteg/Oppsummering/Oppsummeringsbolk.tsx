import React, { MouseEventHandler, ReactNode, useEffect, useState } from 'react';

import { useNavigate } from 'react-router';

import { FormSummary } from '@navikt/ds-react';
import type { ISkjema } from '@navikt/familie-skjema';

import { BASE_PATH } from '../../../../common/miljø';
import { FlettefeltVerdier, LocaleRecordBlock, LocaleRecordString } from '../../../../common/sanity';
import { unslash } from '../../../../common/unslash';
import { useAppContext } from '../../../context/AppContext';
import { useStegContext } from '../../../context/StegContext';
import { ISteg, RouteEnum } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
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
    const { hentStegNummer } = useStegContext();
    const { søknad, tekster, plainTekst } = useAppContext();
    const { validerAlleSynligeFelter, valideringErOk, skjema } = skjemaHook;
    const [visFeil, settVisFeil] = useState(false);

    const feilOppsummeringId = skjema.skjemanavn + '-feil';

    useEffect(() => {
        // Når felter valideres blir nye synlige, så vi må kjøre denne igjen til vi har validert alt
        validerAlleSynligeFelter();
    }, [søknad, skjema]);

    useEffect(() => {
        if (visFeil !== !valideringErOk()) {
            settVisFeil(!valideringErOk());
        }
    }, [skjema]);

    useEffect(() => {
        if (settFeilAnchors) {
            settFeilAnchors(prevState => {
                const utenDetteSkjemaet = prevState.filter(anchor => {
                    return anchor !== feilOppsummeringId;
                });
                return visFeil ? [...utenDetteSkjemaet, feilOppsummeringId] : utenDetteSkjemaet;
            });
        }
    }, [visFeil]);

    const navigate = useNavigate();

    const navigerTilSteg: MouseEventHandler = event => {
        event.preventDefault();
        navigate({
            pathname: steg?.path,
        });
    };

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
            </FormSummary.Header>
            <FormSummary.Answers>
                {children}
                {visFeil && <SkjemaFeiloppsummering skjema={skjema} stegMedFeil={steg} id={feilOppsummeringId} />}
            </FormSummary.Answers>
            {steg && !visFeil && (
                <FormSummary.Footer>
                    <FormSummary.EditLink
                        href={BASE_PATH + unslash(steg.path)}
                        rel="noopener noreferrer"
                        onClick={navigerTilSteg}
                    >
                        {plainTekst(tekster().OPPSUMMERING.endreSvarLenkeTekst)}
                    </FormSummary.EditLink>
                </FormSummary.Footer>
            )}
        </FormSummary>
    );
};

export default Oppsummeringsbolk;
