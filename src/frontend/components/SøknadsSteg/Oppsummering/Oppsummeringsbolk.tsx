import React, { MouseEventHandler, ReactNode, useEffect, useState } from 'react';

import { useNavigate } from 'react-router';

import { FormSummary } from '@navikt/ds-react';
import type { ISkjema } from '@navikt/familie-skjema';

import { BASE_PATH } from '../../../../shared-utils/miljø';
import { unslash } from '../../../../shared-utils/unslash';
import { useAppContext } from '../../../context/AppContext';
import { useStegContext } from '../../../context/StegContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { ISteg } from '../../../typer/routes';
import { FlettefeltVerdier, LocaleRecordBlock, LocaleRecordString } from '../../../typer/sanity/sanity';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { SkjemaFeiloppsummering } from '../../Felleskomponenter/SkjemaFeiloppsummering/SkjemaFeiloppsummering';

interface IHookReturn {
    valideringErOk: () => boolean;
    validerAlleSynligeFelter: () => void;
    skjema: ISkjema<SkjemaFeltTyper, string>;
}

interface Props {
    tittelForSanity: LocaleRecordBlock | LocaleRecordString;
    flettefelter?: FlettefeltVerdier;
    steg: ISteg;
    skjemaHook: IHookReturn;
    settFeilAnchors?: React.Dispatch<React.SetStateAction<string[]>>;
    children?: ReactNode;
    barn?: IBarnMedISøknad;
}

const Oppsummeringsbolk: React.FC<Props> = ({
    children,
    tittelForSanity,
    flettefelter,
    steg,
    skjemaHook,
    settFeilAnchors,
    barn,
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
                    {`${hentStegNummer(steg.route, barn)}. ${plainTekst(tittelForSanity, flettefelter)}`}
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
