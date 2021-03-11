import React from 'react';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import KnappBase, { Flatknapp, Knapp } from 'nav-frontend-knapper';

import { DeleteFilled } from '@navikt/ds-icons';

const mobile = '420px';

const Container = styled.div`
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
        ' tilbake gåVidere '
        ' avsluttOgFortsett avsluttOgFortsett '
        ' avbrytOgSlett avbrytOgSlett';
    grid-template-rows: auto;
    gap: 0.5rem;

    @media all and (max-width: ${mobile}) {
        grid-template-columns: 1fr;
        grid-template-areas:
            ' gåVidere '
            ' tilbake '
            ' avsluttOgFortsett '
            ' avbrytOgSlett';
    }
`;

const StyledTilbakeKnapp = styled(Knapp)`
    grid-area: tilbake;
    place-self: end;
    width: 10rem;
    font-size: 1.125rem;

    @media all and (max-width: ${mobile}) {
        place-self: center;
    }
`;

const StyledGåVidereKnapp = styled(KnappBase)`
    grid-area: gåVidere;
    width: 10rem;
    font-size: 1.125rem;

    @media all and (max-width: ${mobile}) {
        place-self: center;
    }
`;

const StyledAvsluttOgFortsettSenereKnapp = styled(Flatknapp)`
    grid-area: avsluttOgFortsett;
    width: fit-content;
    place-self: center;
    margin-top: 0.5rem;
`;

const StyledAvbrytOgSlettKnapp = styled(Flatknapp)`
    grid-area: avbrytOgSlett;
    width: fit-content;
    place-self: center;
    color: ${navFarger.navMorkGra};
`;

const Navigeringspanel: React.FC<{
    onAvbrytCallback: () => void;
    onTilbakeCallback: () => void;
    kanGåTilNesteSteg: boolean;
}> = ({ onAvbrytCallback, onTilbakeCallback, kanGåTilNesteSteg }) => {
    return (
        <Container>
            <StyledTilbakeKnapp htmlType={'button'} onClick={onTilbakeCallback}>
                <FormattedMessage id={'felles.tilbake'} />
            </StyledTilbakeKnapp>
            <StyledGåVidereKnapp
                htmlType={'submit'}
                type={kanGåTilNesteSteg ? 'hoved' : 'standard'}
            >
                <FormattedMessage id={'felles.gåvidere'} />
            </StyledGåVidereKnapp>
            <StyledAvsluttOgFortsettSenereKnapp mini htmlType={'button'} onClick={onAvbrytCallback}>
                <FormattedMessage id={'felles.avslutt-fortsettsenere'} />
            </StyledAvsluttOgFortsettSenereKnapp>
            <StyledAvbrytOgSlettKnapp mini htmlType={'button'} onClick={onAvbrytCallback}>
                <DeleteFilled />
                <span>
                    <FormattedMessage id={'felles.avbryt-slett'} />
                </span>
            </StyledAvbrytOgSlettKnapp>
        </Container>
    );
};

export default Navigeringspanel;
