import React, { ReactNode, useEffect, useState } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Fareknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';
import Stegindikator from 'nav-frontend-stegindikator';
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useRoutes } from '../../../context/RoutesContext';
import { device } from '../../../Theme';
import { ILokasjon } from '../../../typer/lokasjon';
import { IBarnMedISøknad } from '../../../typer/person';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import {
    OmBarnaDineSpørsmålId,
    omBarnaDineSpørsmålSpråkId,
} from '../../SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnet/spørsmål';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from '../../SøknadsSteg/OmDeg/spørsmål';
import { VelgBarnSpørsmålId } from '../../SøknadsSteg/VelgBarn/spørsmål';
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
    barn?: IBarnMedISøknad;
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

const samletSpørsmålId = {
    ...OmDegSpørsmålId,
    ...VelgBarnSpørsmålId,
    ...OmBarnaDineSpørsmålId,
    ...OmBarnetSpørsmålsId,
};

const Steg: React.FC<ISteg> = ({ tittel, skjema, barn, children }) => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();
    const { settSisteUtfylteStegIndex, erStegUtfyltFrafør, avbrytSøknad } = useApp();
    const {
        erPåKvitteringsside,
        hentNesteRoute,
        hentForrigeRoute,
        hentAktivtStegIndexForStegindikator,
        hentRouteIndex,
        hentStegObjekterForStegIndikator,
    } = useRoutes();

    const [åpenModal, settÅpenModal] = useState(false);

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

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const hentFeilmeldingTilOppsummering = (felt: Felt<any>) => {
        const gyldigId = !!Object.values(samletSpørsmålId).find(id => id === felt.id);
        return !gyldigId ||
            (felt.id === OmDegSpørsmålId.borPåRegistrertAdresse && felt.verdi === ESvar.NEI) ||
            felt.id === VelgBarnSpørsmålId.velgBarn ? (
            felt.feilmelding
        ) : (
            <SpråkTekst id={samletSpørsmålSpråkTekstId[felt.id]} values={{ navn: barn?.navn }} />
        );
    };

    return (
        <>
            <header>
                <Banner språkTekstId={'felles.banner'} />
                <Stegindikator
                    autoResponsiv={true}
                    aktivtSteg={hentAktivtStegIndexForStegindikator(location.pathname)}
                    steg={hentStegObjekterForStegIndikator()}
                    visLabel={false}
                />
            </header>
            <InnholdContainer>
                <StyledSystemtittel>{tittel}</StyledSystemtittel>
                <Form onSubmit={event => håndterGåVidere(event)} autoComplete="off">
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
                                                feilmelding: hentFeilmeldingTilOppsummering(
                                                    felt
                                                ) as string,
                                            };
                                        }
                                    )}
                            />
                        )}
                    {!erPåKvitteringsside(location.pathname) && (
                        <Navigeringspanel
                            onTilbakeCallback={håndterTilbake}
                            onAvbrytCallback={håndterModalStatus}
                            valideringErOk={skjema && skjema.valideringErOk}
                        />
                    )}
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
