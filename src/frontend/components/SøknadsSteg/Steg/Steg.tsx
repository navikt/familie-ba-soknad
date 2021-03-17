import React, { ReactNode, useEffect, useState } from 'react';

import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg.js';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Fareknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import Panel from 'nav-frontend-paneler';
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';
import Stegindikator from 'nav-frontend-stegindikator';
import { Ingress, Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';

import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import {
    hentAktivtStegIndex,
    hentForrigeRoute,
    hentNesteRoute,
    IRoute,
    StegRoutes,
} from '../../../routing/Routes';
import { ILokasjon } from '../../../typer/lokasjon';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import Navigeringspanel from './Navigeringspanel';

interface ISteg {
    tittel: ReactNode;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    skjema: ISkjema<SkjemaFeltTyper, string>;
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

const StyledFeiloppsummering = styled(Feiloppsummering)`
    text-align: left; ;
`;

const Steg: React.FC<ISteg> = ({
    tittel,
    children,
    validerFelterOgVisFeilmelding,
    valideringErOk,
    skjema,
}) => {
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
        if (validerFelterOgVisFeilmelding()) {
            history.push(nesteRoute.path);
        }
    };

    const håndterTilbake = () => {
        history.push(forrigeRoute.path);
    };

    const visFeiloppsummering = (): boolean => {
        const feil = Object.values(skjema.felter).find(
            felt => felt.valideringsstatus === Valideringsstatus.FEIL
        );
        return !!feil;
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
                        {skjema.visFeilmeldinger && visFeiloppsummering() && (
                            <StyledFeiloppsummering
                                tittel={<FormattedMessage id={'felles.feiloppsummering.tittel'} />}
                                feil={Object.entries(skjema.felter)
                                    .filter(feltEntry => {
                                        const felt = feltEntry[1];
                                        return felt.valideringsstatus === Valideringsstatus.FEIL;
                                    })
                                    .map(
                                        (feltEntry): FeiloppsummeringFeil => {
                                            const [feltNavn, felt] = feltEntry;
                                            return {
                                                skjemaelementId: feltNavn,
                                                feilmelding: felt.feilmelding as string,
                                            };
                                        }
                                    )}
                            />
                        )}
                        <Navigeringspanel
                            onTilbakeCallback={håndterTilbake}
                            onAvbrytCallback={håndterModalStatus}
                            valideringErOk={valideringErOk}
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
