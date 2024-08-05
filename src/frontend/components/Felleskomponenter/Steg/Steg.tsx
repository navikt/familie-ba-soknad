import React, { ReactNode, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Box, FormProgress, GuidePanel, Heading } from '@navikt/ds-react';
import { ISkjema } from '@navikt/familie-skjema';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import { useApp } from '../../../context/AppContext';
import { useAppNavigation } from '../../../context/AppNavigationContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { useSteg } from '../../../context/StegContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { device } from '../../../Theme';
import { RouteEnum } from '../../../typer/routes';
import { ISteg as IRoutesSteg } from '../../../typer/routes';
import { LocaleRecordBlock } from '../../../typer/sanity/sanity';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import {
    logKlikkGåVidere,
    logSidevisningBarnetrygd,
    logSkjemaStegFullført,
} from '../../../utils/amplitude';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Banner from '../Banner/Banner';
import InnholdContainer from '../InnholdContainer/InnholdContainer';
import TekstBlock from '../Sanity/TekstBlock';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import useModal from '../SkjemaModal/useModal';

import ModellVersjonModal from './ModellVersjonModal';
import Navigeringspanel from './Navigeringspanel';
import { ScrollHandler } from './ScrollHandler';

interface ISteg {
    tittel: ReactNode;
    guide?: LocaleRecordBlock;
    skjema?: {
        validerFelterOgVisFeilmelding: () => boolean;
        valideringErOk: () => boolean;
        skjema: ISkjema<SkjemaFeltTyper, string>;
        settSøknadsdataCallback: () => void;
    };
    gåVidereCallback?: () => Promise<boolean>;
    children?: ReactNode;
}

const FormProgressContainer = styled.div`
    max-width: var(--innhold-bredde);
    margin: 0 auto;

    @media all and ${device.tablet} {
        max-width: 100%;
        margin: 0 var(--a-spacing-8);
    }
`;

const ChildrenContainer = styled.div`
    margin-bottom: 2rem;
`;

const TittelContainer = styled.div`
    && {
        margin: 4rem auto 3rem auto;

        :focus-visible {
            outline: none;
        }
    }
`;

const Form = styled.form`
    width: 100%;
`;

const Steg: React.FC<ISteg> = ({
    tittel,
    guide = undefined,
    skjema,
    gåVidereCallback,
    children,
}) => {
    const navigate = useNavigate();
    const { erÅpen: erModellVersjonModalÅpen, åpneModal: åpneModellVersjonModal } = useModal();
    const {
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        gåTilbakeTilStart,
        settNåværendeRoute,
        modellVersjonOppdatert,
        søknad,
        tekster,
        plainTekst,
    } = useApp();
    const {
        steg,
        hentNesteSteg,
        hentForrigeSteg,
        hentNåværendeSteg,
        hentNåværendeStegIndex,
        erPåKvitteringsside,
    } = useSteg();
    const { komFra, settKomFra } = useAppNavigation();
    const { toggles } = useFeatureToggles();

    const {
        FORSIDE,
        OM_DEG,
        DIN_LIVSSITUASJON,
        VELG_BARN,
        OM_BARNA,
        OM_BARNET,
        OPPSUMMERING,
        DOKUMENTASJON,
        EØS_FOR_BARN,
        EØS_FOR_SØKER,
        KVITTERING,
    } = tekster();

    const nesteRoute = hentNesteSteg();
    const forrigeRoute = hentForrigeSteg();
    const nåværendeStegIndex = hentNåværendeStegIndex();

    const nyesteNåværendeRoute: RouteEnum = hentNåværendeSteg().route;
    useFørsteRender(() => logSidevisningBarnetrygd(nyesteNåværendeRoute, søknad.søknadstype));

    useEffect(() => {
        window.scrollTo(0, 0);
        document.getElementById('stegHovedtittel')?.focus();
        settNåværendeRoute(nyesteNåværendeRoute);
        if (skjema && erStegUtfyltFrafør(nåværendeStegIndex)) {
            Object.values(skjema.skjema.felter).forEach(felt => {
                felt.validerOgSettFelt(felt.verdi);
            });
        }
        skjulSpråkvelger();
    }, []);

    useEffect(() => {
        modellVersjonOppdatert && !erModellVersjonModalÅpen && åpneModellVersjonModal();
    }, [modellVersjonOppdatert]);

    const skjulSpråkvelger = () => {
        setAvailableLanguages([]).then();
    };

    const håndterAvbryt = () => {
        gåTilbakeTilStart();
        navigate('/');
    };

    const gåVidere = () => {
        if (!erStegUtfyltFrafør(nåværendeStegIndex)) {
            settSisteUtfylteStegIndex(nåværendeStegIndex);
        }
        const målPath = komFra?.path ?? nesteRoute.path;
        komFra && settKomFra(undefined);
        logSkjemaStegFullført(hentNåværendeStegIndex() + 1, søknad.søknadstype);
        navigate(målPath);
    };

    const håndterGåVidere = event => {
        event.preventDefault();
        logKlikkGåVidere(hentNåværendeStegIndex() + 1, søknad.søknadstype);
        if (skjema) {
            if (skjema.validerFelterOgVisFeilmelding()) {
                skjema.settSøknadsdataCallback();
                gåVidere();
            }
        } else if (gåVidereCallback) {
            gåVidereCallback().then(resultat => resultat && gåVidere());
        } else {
            gåVidere();
        }
    };

    const håndterTilbake = () => {
        navigate(forrigeRoute.path);
    };

    interface IRoutesStegMedTittel extends IRoutesSteg {
        tittel: LocaleRecordBlock;
    }

    const formProgressSteps = (): IRoutesStegMedTittel[] => {
        const stegMedTittel = steg.map(steg => {
            let tittel: LocaleRecordBlock;

            switch (steg.route) {
                case RouteEnum.Forside:
                    tittel = FORSIDE.soeknadstittelBarnetrygd;
                    break;
                case RouteEnum.OmDeg:
                    tittel = OM_DEG.omDegTittel;
                    break;
                case RouteEnum.DinLivssituasjon:
                    tittel = DIN_LIVSSITUASJON.dinLivssituasjonTittel;
                    break;
                case RouteEnum.VelgBarn:
                    tittel = VELG_BARN.velgBarnTittel;
                    break;
                case RouteEnum.OmBarna:
                    tittel = OM_BARNA.omBarnaTittel;
                    break;
                case RouteEnum.OmBarnet:
                    tittel = OM_BARNET.omBarnetTittel;
                    break;
                case RouteEnum.EøsForSøker:
                    tittel = EØS_FOR_SØKER.eoesForSokerTittel;
                    break;
                case RouteEnum.EøsForBarn:
                    tittel = EØS_FOR_BARN.eoesForBarnTittel;
                    break;
                case RouteEnum.Oppsummering:
                    tittel = OPPSUMMERING.oppsummeringTittel;
                    break;
                case RouteEnum.Dokumentasjon:
                    tittel = DOKUMENTASJON.dokumentasjonTittel;
                    break;
                case RouteEnum.Kvittering:
                    tittel = KVITTERING.kvitteringTittel;
                    break;
                default:
                    const _exhaustiveCheck: never = steg.route;
                    return _exhaustiveCheck;
            }

            return {
                ...steg,
                tittel: tittel,
            };
        });

        const filtrerteSteg = stegMedTittel.filter(
            steg => steg.route !== RouteEnum.Forside && steg.route !== RouteEnum.Kvittering
        );

        return filtrerteSteg;
    };

    const håndterGåTilSteg = (stegIndex: number) => {
        const steg = formProgressSteps()[stegIndex];
        navigate(steg.path);
    };

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    const formProgressStegTekst =
        plainTekst(frittståendeOrdTekster.steg) +
        ' ' +
        hentNåværendeStegIndex() +
        ' ' +
        plainTekst(frittståendeOrdTekster.av) +
        ' ' +
        formProgressSteps().length;

    return (
        <>
            <ScrollHandler />
            <header>
                <Banner />
                {nyesteNåværendeRoute !== RouteEnum.Kvittering && (
                    <FormProgressContainer>
                        <FormProgress
                            translations={{
                                step: formProgressStegTekst,
                                showAllSteps: plainTekst(frittståendeOrdTekster.visAlleSteg),
                                hideAllSteps: plainTekst(frittståendeOrdTekster.skjulAlleSteg),
                            }}
                            totalSteps={formProgressSteps().length}
                            activeStep={hentNåværendeStegIndex()}
                            onStepChange={stegIndex => håndterGåTilSteg(stegIndex - 1)}
                        >
                            {formProgressSteps().map((value, index) => (
                                <FormProgress.Step
                                    key={index}
                                    completed={index + 1 < hentNåværendeStegIndex()}
                                    interactive={index + 1 < hentNåværendeStegIndex()}
                                >
                                    {value.label}
                                </FormProgress.Step>
                            ))}
                        </FormProgress>
                    </FormProgressContainer>
                )}
            </header>
            <InnholdContainer>
                <TittelContainer id={'stegHovedtittel'} tabIndex={-1}>
                    <Heading level={'2'} size={'large'}>
                        {tittel}
                    </Heading>
                </TittelContainer>
                {toggles.VIS_GUIDE_I_STEG && guide && (
                    <Box marginBlock="0 12">
                        <GuidePanel poster>
                            <TekstBlock block={guide} />
                        </GuidePanel>
                    </Box>
                )}
                <Form onSubmit={event => håndterGåVidere(event)} autoComplete="off">
                    <ChildrenContainer>{children}</ChildrenContainer>
                    {skjema && visFeiloppsummering(skjema.skjema) && (
                        <SkjemaFeiloppsummering skjema={skjema.skjema} />
                    )}
                    {!erPåKvitteringsside() && (
                        <Navigeringspanel
                            onTilbakeCallback={håndterTilbake}
                            onAvbrytCallback={håndterAvbryt}
                            valideringErOk={skjema && skjema.valideringErOk}
                        />
                    )}
                </Form>
                {erModellVersjonModalÅpen && (
                    <ModellVersjonModal erÅpen={erModellVersjonModalÅpen} />
                )}
            </InnholdContainer>
        </>
    );
};

export default Steg;
