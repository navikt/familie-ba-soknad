import React, { ReactNode, useEffect, useState } from 'react';

import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg.js';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Fareknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
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
    Routes,
} from '../../../routing/Routes';
import { device } from '../../../Theme';
import { ILokasjon } from '../../../typer/lokasjon';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { SpråkTekst } from '../../../utils/visning';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
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

    @media all and ${device.mobile} {
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
    }
`;

const ChildrenContainer = styled.div`
    margin-bottom: 2rem;
`;

const StyledSystemtittel = styled(Systemtittel)`
    && {
        margin: 4rem auto 0 auto;
    }
`;

const Form = styled.form`
    max-width: 100%;
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

    const stegobjekter: StegindikatorStegProps[] = Routes.map((steg: IRoute, index: number) => {
        return {
            label: steg.label,
            index: index,
        };
    });

    const nesteRoute: IRoute = hentNesteRoute(Routes, location.pathname);
    const forrigeRoute: IRoute = hentForrigeRoute(Routes, location.pathname);

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
        <>
            <header>
                <Ingress>Søknad om barnetrygd</Ingress>
                <Stegindikator
                    autoResponsiv={true}
                    aktivtSteg={hentAktivtStegIndex(location)}
                    steg={stegobjekter}
                    visLabel={false}
                />
            </header>
            <InnholdContainer>
                <StyledSystemtittel>{tittel}</StyledSystemtittel>
                <Form onSubmit={event => håndterGåVidere(event)}>
                    <ChildrenContainer>{children}</ChildrenContainer>
                    {skjema.visFeilmeldinger && visFeiloppsummering() && (
                        <Feiloppsummering
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
                </Form>

                <StyledModal
                    isOpen={åpenModal}
                    onRequestClose={håndterModalStatus}
                    closeButton={true}
                    contentLabel="avbryt-søknad-modal"
                    shouldCloseOnOverlayClick={true}
                >
                    <StyledUndertittel>
                        <SpråkTekst id={'felles.avbryt-søknadsprosess'} />
                    </StyledUndertittel>
                    <Normaltekst>
                        <SpråkTekst id={'felles.slette-advarsel'} />
                    </Normaltekst>
                    <AvsluttKnappContainer>
                        <Fareknapp onClick={håndterAvbryt}>
                            <SpråkTekst id={'felles.avbryt-slett'} />
                        </Fareknapp>
                    </AvsluttKnappContainer>
                </StyledModal>
            </InnholdContainer>
        </>
    );
};

export default Steg;
