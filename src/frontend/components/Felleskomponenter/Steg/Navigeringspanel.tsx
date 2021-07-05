import React from 'react';

import { useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import KnappBase, { Flatknapp } from 'nav-frontend-knapper';

import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { RouteEnum, useRoutes } from '../../../context/RoutesContext';
import { device } from '../../../Theme';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const Container = styled.nav`
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
        ' tilbake gåVidere '
        ' avsluttOgFortsett avsluttOgFortsett '
        ' avbrytOgSlett avbrytOgSlett';
    grid-template-rows: auto;
    gap: 0.5rem;
    justify-content: center;

    @media all and ${device.mobile} {
        grid-template-columns: 1fr;
        grid-template-areas:
            ' gåVidere '
            ' tilbake '
            ' avsluttOgFortsett '
            ' avbrytOgSlett';
        padding: 2rem 0;
    }
`;

const StyledKnappBase = styled(KnappBase)<{
    placeself: 'end' | 'start';
    gridarea: 'tilbake' | 'gåVidere';
}>`
    grid-area: ${props => props.gridarea};
    min-width: 10rem;
    place-self: ${props => props.placeself};
    font-size: 1.125rem;

    @media all and ${device.mobile} {
        place-self: center;
    }
`;

const StyledFlatKnapp = styled(Flatknapp)<{
    gridarea: 'avsluttOgFortsett' | 'avbrytOgSlett';
    color: string;
    margintop: string;
}>`
    grid-area: ${props => props.gridarea};
    width: fit-content;
    place-self: center;
    margin-top: ${props => props.margintop};
    && {
        color: ${props => props.color};
    }
`;

type Knappetype = 'hoved' | 'standard';

const Navigeringspanel: React.FC<{
    onAvbrytCallback: () => void;
    onTilbakeCallback: () => void;
    valideringErOk: (() => boolean) | undefined;
}> = ({ onAvbrytCallback, onTilbakeCallback, valideringErOk }) => {
    const { hentNesteRoute } = useRoutes();
    const location = useLocation();
    const nesteRoute = hentNesteRoute(location.pathname);
    const { innsendingStatus } = useApp();

    const hentKnappetype = (): Knappetype => {
        if (valideringErOk) {
            return valideringErOk() ? 'hoved' : 'standard';
        } else {
            return 'hoved';
        }
    };

    return (
        <Container>
            <StyledKnappBase
                kompakt={true}
                htmlType={'button'}
                onClick={onTilbakeCallback}
                placeself={'end'}
                gridarea={'tilbake'}
            >
                <SpråkTekst id={'felles.navigasjon.tilbake'} />
            </StyledKnappBase>
            <StyledKnappBase
                kompakt={true}
                htmlType={'submit'}
                type={hentKnappetype()}
                placeself={'start'}
                gridarea={'gåVidere'}
                spinner={innsendingStatus.status === RessursStatus.HENTER}
                autoDisableVedSpinner={true}
            >
                <SpråkTekst
                    id={
                        nesteRoute.route === RouteEnum.Kvittering
                            ? 'dokumentasjon.send-søknad.knapp'
                            : 'felles.navigasjon.gå-videre'
                    }
                />
            </StyledKnappBase>

            <StyledFlatKnapp
                mini
                htmlType={'button'}
                onClick={onAvbrytCallback}
                color={navFarger.navMorkGra}
                gridarea={'avbrytOgSlett'}
                margintop={'0'}
            >
                <SpråkTekst id={'felles.navigasjon.avbryt'} />
            </StyledFlatKnapp>
        </Container>
    );
};

export default Navigeringspanel;
