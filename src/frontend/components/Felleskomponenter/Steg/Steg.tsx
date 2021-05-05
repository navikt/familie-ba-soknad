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
import { IRoute, useRoutes } from '../../../context/RoutesContext';
import { device } from '../../../Theme';
import { ILokasjon } from '../../../typer/lokasjon';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { omBarnaDineSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnaDine/spørsmål';
import { omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnetUtfyllende/spørsmål';
import { omDegSpørsmålSpråkId } from '../../SøknadsSteg/OmDeg/spørsmål';
import Banner from '../Banner/Banner';
import InnholdContainer from '../InnholdContainer/InnholdContainer';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import Navigeringspanel from './Navigeringspanel';

interface ISteg {
    tittel: ReactNode;
    skjema?: {
        validerFelterOgVisFeilmelding: () => boolean;
        valideringErOk: () => boolean;
        skjema: ISkjema<SkjemaFeltTyper, string>;
        settSøknadsdataCallback: () => void;
    };
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
        margin: 4rem auto 3rem auto;
    }
`;

const Form = styled.form`
    width: 100%;
`;

const samletSpørsmålSpråkTekstId = {
    ...omDegSpørsmålSpråkId,
    ...omBarnaDineSpørsmålSpråkId,
    ...omBarnetSpørsmålSpråkId,
};

const Steg: React.FC<ISteg> = ({ tittel, skjema, children }) => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();
    const { settSisteUtfylteStegIndex, erStegUtfyltFrafør, avbrytSøknad } = useApp();
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
        if (skjema && erStegUtfyltFrafør(nåværendeStegIndex)) {
            Object.values(skjema.skjema.felter).forEach(felt => {
                felt.validerOgSettFelt();
            });
        }
    }, []);

    const håndterModalStatus = () => {
        settÅpenModal(!åpenModal);
    };

    const håndterAvbryt = () => {
        avbrytSøknad();
        history.push('/');
    };
    const gåVidere = () => {
        if (!erStegUtfyltFrafør(nåværendeStegIndex)) {
            settSisteUtfylteStegIndex(nåværendeStegIndex);
        }
        history.push(nesteRoute.path);
    };

    const håndterGåVidere = event => {
        event.preventDefault();
        if (skjema) {
            if (skjema.validerFelterOgVisFeilmelding()) {
                skjema.settSøknadsdataCallback();
                gåVidere();
            }
        } else {
            gåVidere();
        }
    };

    const håndterTilbake = () => {
        history.push(forrigeRoute.path);
    };

    const visFeiloppsummering = (skjema: ISkjema<SkjemaFeltTyper, string>): boolean => {
        const feil = Object.values(skjema.felter).find(
            felt => felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL
        );
        return !!feil;
    };

    return (
        <>
            <header>
                <Banner språkTekstId={'felles.banner'} />
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
                    {skjema &&
                        skjema.skjema.visFeilmeldinger &&
                        visFeiloppsummering(skjema.skjema) && (
                            <Feiloppsummering
                                tittel={<SpråkTekst id={'felles.feiloppsummering.tittel'} />}
                                feil={Object.values(skjema.skjema.felter)
                                    .filter(felt => {
                                        return (
                                            felt.erSynlig &&
                                            felt.valideringsstatus === Valideringsstatus.FEIL
                                        );
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
                        valideringErOk={skjema && skjema.valideringErOk}
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
