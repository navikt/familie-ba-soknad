import React, { useEffect, useState } from 'react';

import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Undertittel } from 'nav-frontend-typografi';

import { ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IRoute, RouteEnum, useRoutes } from '../../../context/RoutesContext';
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
    route?: IRoute;
    skjemaHook: (...args: string[]) => IHookReturn;
    ident?: string;
}

const StyledOppsummeringsbolk = styled.div`
    border-bottom: 2px solid ${navFarger.navGra60};
`;

const StyledEkspanderbartpanel = styled(Ekspanderbartpanel)`
    && button {
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
    route,
    skjemaHook,
    ident,
}) => {
    const { hentStegNummer } = useRoutes();
    const { søknad } = useApp();
    const { validerAlleSynligeFelter, valideringErOk, skjema } = ident
        ? skjemaHook(ident)
        : skjemaHook();
    const [visFeil, settVisFeil] = useState(false);

    useEffect(() => {
        // Når felter valideres blir nye synlige, så vi må kjøre denne igjen til vi har validert alt
        validerAlleSynligeFelter();
    }, [søknad, skjema]);

    useEffect(() => {
        settVisFeil(!valideringErOk());
    }, [skjema]);

    return (
        <StyledOppsummeringsbolk>
            <StyledEkspanderbartpanel
                tittel={
                    <Undertittel>
                        {`${hentStegNummer(route?.route ?? RouteEnum.OmDeg)}. `}
                        <SpråkTekst id={tittel} values={språkValues} />
                    </Undertittel>
                }
                border={false}
                apen={true}
            >
                {children}

                {visFeil && (
                    <SkjemaFeiloppsummering skjema={skjema} routeForFeilmeldinger={route} />
                )}
                {route && !visFeil && (
                    <AppLenke route={route} språkTekstId={'oppsummering.endresvar.lenketekst'} />
                )}
            </StyledEkspanderbartpanel>
        </StyledOppsummeringsbolk>
    );
};

export default Oppsummeringsbolk;
