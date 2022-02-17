import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import navFarger from 'nav-frontend-core';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Undertittel } from 'nav-frontend-typografi';

import { ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { ISteg, RouteEnum } from '../../../typer/routes';
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
    steg?: ISteg;
    skjemaHook: IHookReturn;
    settFeilAnchors?: React.Dispatch<React.SetStateAction<string[]>>;
}

const StyledOppsummeringsbolk = styled.div`
    border-bottom: 2px solid ${navFarger.navGra60};
`;

const StyledEkspanderbartpanel = styled(Ekspanderbartpanel)`
    && :hover {
        box-shadow: none;
        border-radius: 0;
        :focus {
            border: solid 3px ${navFarger.fokusFarge};
            border-radius: 0.25rem;
        }
    }
`;

const Oppsummeringsbolk: React.FC<Props> = ({
    children,
    tittel,
    språkValues,
    steg,
    skjemaHook,
    settFeilAnchors,
}) => {
    const { hentStegNummer } = useSteg();
    const { søknad } = useApp();
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
        <StyledOppsummeringsbolk>
            <StyledEkspanderbartpanel
                tittel={
                    <Undertittel>
                        {steg?.route !== RouteEnum.OmBarnet &&
                            steg?.route !== RouteEnum.EøsForBarn &&
                            `${hentStegNummer(steg?.route ?? RouteEnum.OmDeg)}. `}
                        <SpråkTekst id={tittel} values={språkValues} />
                    </Undertittel>
                }
                border={false}
                apen={true}
            >
                {children}

                {visFeil && (
                    <SkjemaFeiloppsummering
                        skjema={skjema}
                        routeForFeilmeldinger={steg}
                        id={feilOppsummeringId}
                    />
                )}
                {steg && !visFeil && (
                    <AppLenke steg={steg} språkTekstId={'oppsummering.endresvar.lenketekst'} />
                )}
            </StyledEkspanderbartpanel>
        </StyledOppsummeringsbolk>
    );
};

export default Oppsummeringsbolk;
