import React from 'react';

import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import KnappBase, { Flatknapp } from 'nav-frontend-knapper';

import { DeleteFilled } from '@navikt/ds-icons';

import { device } from '../../../Theme';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

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
    width: 10rem;
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
                htmlType={'button'}
                onClick={onTilbakeCallback}
                placeself={'end'}
                gridarea={'tilbake'}
            >
                <SpråkTekst id={'felles.navigasjon.tilbake'} />
            </StyledKnappBase>
            <StyledKnappBase
                htmlType={'submit'}
                type={hentKnappetype()}
                placeself={'start'}
                gridarea={'gåVidere'}
            >
                <SpråkTekst id={'felles.navigasjon.gå-videre'} />
            </StyledKnappBase>
            <StyledFlatKnapp
                mini
                htmlType={'button'}
                onClick={() => {
                    //TODO: enten fjerne knapp eller legge til mellomlagring
                    alert('ikke implementert enda');
                }}
                color={navFarger.navBla}
                gridarea={'avsluttOgFortsett'}
                margintop={'0.5rem'}
            >
                <SpråkTekst id={'felles.navigasjon.avsluttogfortsett'} />
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
                    <SpråkTekst id={'felles.navigasjon.avsluttogslett'} />
                </span>
            </StyledFlatKnapp>
        </Container>
    );
};

export default Navigeringspanel;
