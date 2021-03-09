import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg.js';
import { useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Fareknapp, Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import Panel from 'nav-frontend-paneler';
import Stegindikator from 'nav-frontend-stegindikator';
import { Systemtittel, Ingress, Undertittel, Normaltekst } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { StegRoutes, hentAktivtStegIndex } from '../../../routing/Routes';
import { IStegRoute, hentNesteRoute, hentForrigeRoute } from '../../../routing/Routes';
import { ILokasjon } from '../../../typer/lokasjon';
import { ESteg } from '../../../typer/søknad';

interface ISteg {
    tittel: string;
    kanGåTilNesteSteg: () => boolean;
    className?: string;
}

const mobile = '420px';
const tablet = '959px';
const knappWidth = '9.5rem';
const panelInnholdBredde = '588px';

const AvsluttKnappContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 2rem;

    @media all and (max-width: ${mobile}) {
        width: 100%;
    }
`;

const StyledAvbrytKnapp = styled(Flatknapp)`
    margin-top: 1rem;
    justify-content: center;
    width: ${knappWidth};
`;

const StyledTilbakeknapp = styled(Knapp)`
    width: ${knappWidth};

    @media all and (max-width: ${mobile}) {
        width: 100%;
        margin-top: 1rem;
    }
`;

const StyledUndertittel = styled(Undertittel)`
    && {
        margin: 2rem 0 1rem 0;
    }
`;

const StyledModal = styled(Modal)`
    && {
        padding: 2rem 2rem 2rem;
        text-align: center;
    }
`;

const StegContainer = styled.div`
    text-align: center;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10rem;

    .stegindikator__liste {
        margin: 2rem 0;
    }
`;

const KnappeContainer = styled.div`
    padding: 2rem;
    display: flex;
    justify-self: center;
    flex-direction: column;
    align-items: center;
`;

const KnappeRadContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    min-width: ${knappWidth};

    @media all and (max-width: ${mobile}) {
        flex-direction: column-reverse;
    }
`;

const StyledPanel = styled(Panel)`
    padding: 2rem;
    width: ${panelInnholdBredde};

    @media all and (max-width: ${tablet}) {
        width: auto;
    }
`;

const ChildrenContainer = styled.div`
    margin-top: 2rem;
`;

const Steg: React.FC<ISteg> = ({ tittel, children, kanGåTilNesteSteg, className }) => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();
    const { settUtfyltSteg } = useApp();

    const [åpenModal, settÅpenModal] = useState(false);

    const stegobjekter: StegindikatorStegProps[] = StegRoutes.map(
        (steg: IStegRoute, index: number) => {
            return {
                label: steg.label,
                index: index,
            };
        }
    );

    const nesteRoute: IStegRoute = hentNesteRoute(StegRoutes, location.pathname);
    const forrigeRoute: IStegRoute = hentForrigeRoute(StegRoutes, location.pathname);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const håndterModalStatus = () => {
        settÅpenModal(!åpenModal);
    };

    const håndterAvbryt = () => {
        settUtfyltSteg(0);
        history.push('/');
    };

    const håndterNeste = () => {
        if (kanGåTilNesteSteg()) {
            history.push(nesteRoute.path);
        }
    };

    const håndterTilbake = () => {
        history.push(forrigeRoute.path);
    };

    return (
        <StegContainer className={classNames('steg', className)}>
            <Ingress>Søknad om barnetrygd</Ingress>
            <Stegindikator
                autoResponsiv={true}
                aktivtSteg={hentAktivtStegIndex(location)}
                steg={stegobjekter}
                visLabel={false}
            />
            <StyledPanel>
                <main>
                    <Systemtittel>{tittel}</Systemtittel>
                    <ChildrenContainer>{children}</ChildrenContainer>
                </main>
            </StyledPanel>
            <KnappeContainer>
                <KnappeRadContainer>
                    {hentAktivtStegIndex(location) > ESteg.STEG_EN && (
                        <StyledTilbakeknapp onClick={håndterTilbake}>Tilbake</StyledTilbakeknapp>
                    )}
                    <Hovedknapp onClick={håndterNeste}>Neste</Hovedknapp>
                </KnappeRadContainer>

                <StyledAvbrytKnapp onClick={håndterModalStatus}>Avbryt</StyledAvbrytKnapp>
            </KnappeContainer>
            <StyledModal
                isOpen={åpenModal}
                onRequestClose={håndterModalStatus}
                closeButton={true}
                contentLabel="avbryt-søknad-modal"
                shouldCloseOnOverlayClick={true}
            >
                <StyledUndertittel>
                    Er du sikker på at du vil avbryte søknadprosessen?
                </StyledUndertittel>
                <Normaltekst>Hvis du avbryter vil innholdet i søknaden bli slettet.</Normaltekst>
                <AvsluttKnappContainer>
                    <Fareknapp onClick={håndterAvbryt}>Avbryt søknad</Fareknapp>
                </AvsluttKnappContainer>
            </StyledModal>
        </StegContainer>
    );
};

export default Steg;
