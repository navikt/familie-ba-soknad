import React from 'react';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import KnappBase, { Flatknapp } from 'nav-frontend-knapper';

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

const StyledKnappBase = styled(KnappBase)<{
    placeself: 'end' | 'start';
    gridarea: 'tilbake' | 'gåVidere';
}>`
    grid-area: ${props => props.gridarea};
    width: 10rem;
    place-self: ${props => props.placeself};
    font-size: 1.125rem;

    @media all and (max-width: ${mobile}) {
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

const Navigeringspanel: React.FC<{
    onAvbrytCallback: () => void;
    onTilbakeCallback: () => void;
    valideringErOk: () => boolean;
}> = ({ onAvbrytCallback, onTilbakeCallback, valideringErOk }) => {
    return (
        <Container>
            <StyledKnappBase
                htmlType={'button'}
                onClick={onTilbakeCallback}
                placeself={'end'}
                gridarea={'tilbake'}
            >
                <FormattedMessage id={'felles.tilbake'} />
            </StyledKnappBase>
            <StyledKnappBase
                htmlType={'submit'}
                type={valideringErOk() ? 'hoved' : 'standard'}
                placeself={'start'}
                gridarea={'gåVidere'}
            >
                <FormattedMessage id={'felles.gåvidere'} />
            </StyledKnappBase>
            <StyledFlatKnapp
                mini
                htmlType={'button'}
                onClick={onAvbrytCallback}
                color={navFarger.navBla}
                gridarea={'avsluttOgFortsett'}
                margintop={'0.5rem'}
            >
                <FormattedMessage id={'felles.avslutt-fortsettsenere'} />
            </StyledFlatKnapp>
            <StyledFlatKnapp
                mini
                htmlType={'button'}
                onClick={onAvbrytCallback}
                color={navFarger.navMorkGra}
                gridarea={'avbrytOgSlett'}
                margintop={'0'}
            >
                <DeleteFilled />
                <span>
                    <FormattedMessage id={'felles.avbryt-slett'} />
                </span>
            </StyledFlatKnapp>
        </Container>
    );
};

export default Navigeringspanel;
