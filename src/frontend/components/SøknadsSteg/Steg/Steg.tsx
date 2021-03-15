import React, { useEffect, useState } from 'react';

import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg.js';
import { useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Fareknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import Panel from 'nav-frontend-paneler';
import Stegindikator from 'nav-frontend-stegindikator';
import { Systemtittel, Ingress, Undertittel, Normaltekst } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import {
    StegRoutes,
    hentAktivtStegIndex,
    hentNesteRoute,
    hentForrigeRoute,
} from '../../../routing/Routes';
import { IRoute } from '../../../routing/Routes';
import { ILokasjon } from '../../../typer/lokasjon';
import Navigeringspanel from './Navigeringspanel';

interface ISteg {
    tittel: string;
    kanGåTilNesteSteg: () => boolean;
}

const AvsluttKnappContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 2rem;

    @media all and (max-width: var(--mobile)) {
        width: 100%;
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

const StyledPanel = styled(Panel)`
    padding: 2rem;
    width: var(--panel-innhold-bredde);

    @media all and (max-width: var(--tablet)) {
        width: auto;
    }
`;

const ChildrenContainer = styled.div`
    margin-top: 2rem;
`;

const Steg: React.FC<ISteg> = ({ tittel, children, kanGåTilNesteSteg }) => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();
    const { settUtfyltSteg } = useApp();

    const [åpenModal, settÅpenModal] = useState(false);

    const stegobjekter: StegindikatorStegProps[] = StegRoutes.map((steg: IRoute, index: number) => {
        return {
            label: steg.label,
            index: index,
        };
    });

    const nesteRoute: IRoute = hentNesteRoute(StegRoutes, location.pathname);
    const forrigeRoute: IRoute = hentForrigeRoute(StegRoutes, location.pathname);

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

    const håndterGåVidere = event => {
        event.preventDefault();
        if (kanGåTilNesteSteg()) {
            history.push(nesteRoute.path);
        }
    };

    const håndterTilbake = () => {
        history.push(forrigeRoute.path);
    };

    return (
        <StegContainer>
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
                    <form onSubmit={event => håndterGåVidere(event)}>
                        <ChildrenContainer>{children}</ChildrenContainer>
                        <Navigeringspanel
                            onTilbakeCallback={håndterTilbake}
                            onAvbrytCallback={håndterModalStatus}
                        />
                    </form>
                </main>
            </StyledPanel>

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
