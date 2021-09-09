import React, { ReactNode, useEffect } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';

import Stegindikator from 'nav-frontend-stegindikator';
import { Systemtittel } from 'nav-frontend-typografi';

import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useAppNavigation } from '../../../context/AppNavigationContext';
import { useRoutes } from '../../../context/RoutesContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { ILokasjon } from '../../../typer/lokasjon';
import { IBarnMedISøknad } from '../../../typer/person';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import {
    logKlikkGåVidere,
    logSidevisningBarnetrygd,
    logSkjemaStegFullført,
} from '../../../utils/amplitude';
import Banner from '../Banner/Banner';
import InnholdContainer from '../InnholdContainer/InnholdContainer';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import Navigeringspanel from './Navigeringspanel';
import { ScrollHandler } from './ScrollHandler';

interface ISteg {
    tittel: ReactNode;
    skjema?: {
        validerFelterOgVisFeilmelding: () => boolean;
        valideringErOk: () => boolean;
        skjema: ISkjema<SkjemaFeltTyper, string>;
        settSøknadsdataCallback: () => void;
    };
    barn?: IBarnMedISøknad;
    gåVidereCallback?: () => Promise<boolean>;
}

const ChildrenContainer = styled.div`
    margin-bottom: 2rem;
`;

const StyledSystemtittel = styled(Systemtittel)`
    && {
        margin: 4rem auto 3rem auto;
    }
`;

const Form = styled.form`
    width: 100%;
`;

const StegindikatorContainer = styled.div`
    margin: 0 1rem;
`;

const Steg: React.FC<ISteg> = ({ tittel, skjema, barn, gåVidereCallback, children }) => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();
    const {
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        gåTilbakeTilStart,
        erUtvidet,
    } = useApp();
    const {
        hentNesteRoute,
        hentForrigeRoute,
        hentAktivtStegIndexForStegindikator,
        hentRouteIndex,
        hentStegObjekterForStegIndikator,
        erPåKvitteringsside,
        hentNåværendeRoute,
    } = useRoutes();
    const { komFra, settKomFra } = useAppNavigation();

    const nesteRoute = hentNesteRoute(location.pathname);
    const forrigeRoute = hentForrigeRoute(location.pathname);
    const nåværendeStegIndex = hentRouteIndex(location.pathname);
    const nåværendeRoute = hentNåværendeRoute(location.pathname).route;

    useFørsteRender(() => logSidevisningBarnetrygd(nåværendeRoute));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (skjema && erStegUtfyltFrafør(nåværendeStegIndex)) {
            Object.values(skjema.skjema.felter).forEach(felt => {
                felt.validerOgSettFelt();
            });
        }
    }, []);

    const håndterAvbryt = () => {
        gåTilbakeTilStart();
        history.push('/');
    };

    const gåVidere = () => {
        if (!erStegUtfyltFrafør(nåværendeStegIndex)) {
            settSisteUtfylteStegIndex(nåværendeStegIndex);
        }
        const målPath = komFra?.path ?? nesteRoute.path;
        komFra && settKomFra(undefined);
        logSkjemaStegFullført(hentAktivtStegIndexForStegindikator(location.pathname) + 1);
        history.push(målPath);
    };

    const håndterGåVidere = event => {
        event.preventDefault();
        logKlikkGåVidere(hentAktivtStegIndexForStegindikator(location.pathname) + 1);
        if (skjema) {
            if (skjema.validerFelterOgVisFeilmelding()) {
                skjema.settSøknadsdataCallback();
                gåVidere();
            }
        } else if (gåVidereCallback) {
            gåVidereCallback().then(resultat => resultat && gåVidere());
        } else {
            gåVidere();
        }
    };

    const håndterTilbake = () => {
        history.push(forrigeRoute.path);
    };

    const visFeiloppsummering = (skjema: ISkjema<SkjemaFeltTyper, string>): boolean => {
        const feil = Object.values(skjema.felter).find(
            felt => felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL
        );
        return !!feil;
    };

    return (
        <>
            <ScrollHandler />
            <header>
                <Banner språkTekstId={erUtvidet ? 'felles.banner.utvidet' : 'felles.banner'} />
                <StegindikatorContainer>
                    <Stegindikator
                        autoResponsiv={true}
                        aktivtSteg={hentAktivtStegIndexForStegindikator(location.pathname)}
                        steg={hentStegObjekterForStegIndikator()}
                        visLabel={false}
                    />
                </StegindikatorContainer>
            </header>
            <InnholdContainer>
                <StyledSystemtittel>{tittel}</StyledSystemtittel>
                <Form onSubmit={event => håndterGåVidere(event)} autoComplete="off">
                    <ChildrenContainer>{children}</ChildrenContainer>
                    {skjema &&
                        skjema.skjema.visFeilmeldinger &&
                        visFeiloppsummering(skjema.skjema) && (
                            <SkjemaFeiloppsummering
                                skjema={skjema.skjema}
                                barn={barn ?? undefined}
                            />
                        )}
                    {!erPåKvitteringsside(location.pathname) && (
                        <Navigeringspanel
                            onTilbakeCallback={håndterTilbake}
                            onAvbrytCallback={håndterAvbryt}
                            valideringErOk={skjema && skjema.valideringErOk}
                        />
                    )}
                </Form>
            </InnholdContainer>
        </>
    );
};

export default Steg;
