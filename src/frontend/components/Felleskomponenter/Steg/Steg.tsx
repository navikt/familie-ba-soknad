import React, { ReactNode, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Box, FormProgress, GuidePanel, Heading, Link, VStack } from '@navikt/ds-react';
import { ISkjema } from '@navikt/familie-skjema';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import { useApp } from '../../../context/AppContext';
import { useAppNavigation } from '../../../context/AppNavigationContext';
import { useSteg } from '../../../context/StegContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { device } from '../../../Theme';
import { RouteEnum } from '../../../typer/routes';
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
import { useFormProgressSteg } from './useFormProgressSteg';

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

const TopNavigasjonContainer = styled.div`
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

const Steg: React.FC<ISteg> = ({ tittel, guide, skjema, gåVidereCallback, children }) => {
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
        hentNesteSteg,
        hentForrigeSteg,
        hentNåværendeSteg,
        hentNåværendeStegIndex,
        erPåKvitteringsside,
    } = useSteg();
    const { komFra, settKomFra } = useAppNavigation();

    const nesteRoute = hentNesteSteg();
    const forrigeRoute = hentForrigeSteg();
    const nåværendeStegIndex = hentNåværendeStegIndex();
    const formProgressSteg = useFormProgressSteg();

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

    const håndterGåTilSteg = (stegIndex: number) => {
        const steg = formProgressSteg[stegIndex];
        navigate(steg.path);
    };

    const { tilbakeKnapp } = tekster().FELLES.navigasjon;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    const formProgressStegOppsummeringTekst = `${plainTekst(frittståendeOrdTekster.steg)} ${hentNåværendeStegIndex()} ${plainTekst(frittståendeOrdTekster.av)} ${formProgressSteg.length}`;

    return (
        <>
            <ScrollHandler />
            <header>
                <Banner />
                {nyesteNåværendeRoute !== RouteEnum.Kvittering && (
                    <TopNavigasjonContainer>
                        <VStack gap="4">
                            <div>
                                <Link
                                    href={forrigeRoute.path}
                                    variant="action"
                                    onClick={event => {
                                        event.preventDefault();
                                        håndterTilbake();
                                    }}
                                >
                                    <ArrowLeftIcon aria-hidden />
                                    {plainTekst(tilbakeKnapp)}
                                </Link>
                            </div>
                            <FormProgress
                                translations={{
                                    step: formProgressStegOppsummeringTekst,
                                    showAllSteps: plainTekst(frittståendeOrdTekster.visAlleSteg),
                                    hideAllSteps: plainTekst(frittståendeOrdTekster.skjulAlleSteg),
                                }}
                                totalSteps={formProgressSteg.length}
                                activeStep={hentNåværendeStegIndex()}
                                onStepChange={stegIndex => håndterGåTilSteg(stegIndex - 1)}
                            >
                                {formProgressSteg.map((value, index) => (
                                    <FormProgress.Step
                                        key={index}
                                        completed={index + 1 < hentNåværendeStegIndex()}
                                        interactive={index + 1 < hentNåværendeStegIndex()}
                                    >
                                        {value.tittel}
                                    </FormProgress.Step>
                                ))}
                            </FormProgress>
                        </VStack>
                    </TopNavigasjonContainer>
                )}
            </header>
            <InnholdContainer>
                <TittelContainer>
                    <Heading level={'2'} size={'large'}>
                        {tittel}
                    </Heading>
                </TittelContainer>
                {guide && (
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
