import React from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { device } from '../../../Theme';
import { RouteEnum } from '../../../typer/routes';
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

const StyledKnapp = styled(Button)<{
    placeself: 'end' | 'start';
    gridarea: 'tilbake' | 'gåVidere';
}>`
    && {
        grid-area: ${props => props.gridarea};
        min-width: 10rem;
        place-self: ${props => props.placeself};
        font-size: 1.125rem;
        @media all and ${device.mobile} {
            place-self: center;
        }
    }
`;

const StyledAvbrytKnapp = styled(Button)<{
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

type Knappetype = 'primary' | 'secondary';

const Navigeringspanel: React.FC<{
    onAvbrytCallback: () => void;
    onTilbakeCallback: () => void;
    valideringErOk: (() => boolean) | undefined;
}> = ({ onAvbrytCallback, onTilbakeCallback, valideringErOk }) => {
    const { hentNesteSteg } = useSteg();
    const nesteSteg = hentNesteSteg();
    const { innsendingStatus } = useApp();

    const hentKnappetype = (): Knappetype => {
        if (valideringErOk) {
            return valideringErOk() ? 'primary' : 'secondary';
        } else {
            return 'primary';
        }
    };

    return (
        <Container>
            <StyledKnapp
                variant={'secondary'}
                htmlType={'button'}
                onClick={onTilbakeCallback}
                placeself={'end'}
                gridarea={'tilbake'}
            >
                <SpråkTekst id={'felles.navigasjon.tilbake'} />
            </StyledKnapp>
            <StyledKnapp
                htmlType={'submit'}
                variant={hentKnappetype()}
                placeself={'start'}
                gridarea={'gåVidere'}
                spinner={innsendingStatus.status === RessursStatus.HENTER}
                autoDisableVedSpinner={true}
            >
                <SpråkTekst
                    id={
                        nesteSteg.route === RouteEnum.Kvittering
                            ? 'dokumentasjon.send-søknad.knapp'
                            : 'felles.navigasjon.gå-videre'
                    }
                />
            </StyledKnapp>

            <StyledAvbrytKnapp
                variant={'tertiary'}
                htmlType={'button'}
                onClick={onAvbrytCallback}
                gridarea={'avbrytOgSlett'}
                margintop={'0'}
            >
                <SpråkTekst id={'felles.navigasjon.avbryt'} />
            </StyledAvbrytKnapp>
        </Container>
    );
};

export default Navigeringspanel;
