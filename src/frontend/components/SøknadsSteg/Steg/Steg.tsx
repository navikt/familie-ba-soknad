import React, { ReactNode, useEffect, useState } from 'react';

import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg.js';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Fareknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';
import Stegindikator from 'nav-frontend-stegindikator';
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';

import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IRoute, useRoutes } from '../../../routing/RoutesContext';
import { device } from '../../../Theme';
import { ILokasjon } from '../../../typer/lokasjon';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import Banner from '../../Felleskomponenter/Banner/Banner';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Navigeringspanel from './Navigeringspanel';

interface ISteg {
    tittel: ReactNode;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    settSøknadsdataCallback: () => void;
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
        margin: 4rem auto 2rem auto;
    }
`;

const Form = styled.form`
    width: 100%;
`;

const Steg: React.FC<ISteg> = ({
    tittel,
    children,
    validerFelterOgVisFeilmelding,
    valideringErOk,
    skjema,
    settSøknadsdataCallback,
}) => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();
    const { settSisteUtfylteStegIndex, erStegUtfyltFrafør } = useApp();
    const {
        routes,
        hentNesteRoute,
        hentForrigeRoute,
        hentAktivtStegIndexForStegindikator,
        hentRouteIndex,
    } = useRoutes();

    const [åpenModal, settÅpenModal] = useState(false);

    const stegobjekter: StegindikatorStegProps[] = routes.map((steg: IRoute, index: number) => {
        return {
            label: steg.label,
            index: index,
        };
    });

    const nesteRoute = hentNesteRoute(location.pathname);
    const forrigeRoute = hentForrigeRoute(location.pathname);
    const nåværendeStegIndex = hentRouteIndex(location.pathname);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (erStegUtfyltFrafør(nåværendeStegIndex)) {
            Object.values(skjema.felter).forEach(felt => {
                felt.validerOgSettFelt();
            });
        }
    }, []);

    const håndterModalStatus = () => {
        settÅpenModal(!åpenModal);
    };

    const håndterAvbryt = () => {
        settSisteUtfylteStegIndex(0);
        history.push('/');
    };

    const håndterGåVidere = event => {
        event.preventDefault();
        if (validerFelterOgVisFeilmelding()) {
            settSøknadsdataCallback();
            if (!erStegUtfyltFrafør(nåværendeStegIndex)) {
                settSisteUtfylteStegIndex(nåværendeStegIndex);
            }
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
                <Banner språkTekstId={'felles.overskrift.ordinær-barnetrygd'} />
                <Stegindikator
                    autoResponsiv={true}
                    aktivtSteg={hentAktivtStegIndexForStegindikator(location.pathname)}
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
                            tittel={<SpråkTekst id={'felles.feiloppsummering.tittel'} />}
                            feil={Object.values(skjema.felter)
                                .filter(felt => {
                                    return felt.valideringsstatus === Valideringsstatus.FEIL;
                                })
                                .map(
                                    (felt): FeiloppsummeringFeil => {
                                        return {
                                            skjemaelementId: felt.id,
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
