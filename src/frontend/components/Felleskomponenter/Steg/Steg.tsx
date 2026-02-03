import React, { ReactNode, useEffect } from 'react';

import { useNavigate } from 'react-router';

import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Alert, Box, FormProgress, GuidePanel, Heading, Link, VStack } from '@navikt/ds-react';
import type { ISkjema } from '@navikt/familie-skjema';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import { LocaleRecordBlock } from '../../../../common/sanity';
import { useAppContext } from '../../../context/AppContext';
import { useAppNavigationContext } from '../../../context/AppNavigationContext';
import { useStegContext } from '../../../context/StegContext';
import { RouteEnum } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import InnholdContainer from '../InnholdContainer/InnholdContainer';
import TekstBlock from '../Sanity/TekstBlock';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import useModal from '../SkjemaModal/useModal';
import { VedleggOppsummering } from '../VedleggOppsummering/VedleggOppsummering';
import { skalVedleggOppsummeringVises } from '../VedleggOppsummering/vedleggOppsummering.domene';
import { IVedleggOppsummering } from '../VedleggOppsummering/vedleggOppsummering.types';

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
    vedleggOppsummering?: IVedleggOppsummering[];
    children?: ReactNode;
}

const Steg: React.FC<ISteg> = ({ tittel, guide, skjema, gåVidereCallback, vedleggOppsummering, children }) => {
    const navigate = useNavigate();
    const { erÅpen: erModellVersjonModalÅpen, åpneModal: åpneModellVersjonModal } = useModal();
    const {
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        gåTilbakeTilStart,
        settNåværendeRoute,
        modellVersjonOppdatert,
        tekster,
        plainTekst,
    } = useAppContext();
    const { hentNesteSteg, hentForrigeSteg, hentNåværendeSteg, hentNåværendeStegIndex, erPåKvitteringsside } =
        useStegContext();
    const { komFra, settKomFra } = useAppNavigationContext();

    const nesteRoute = hentNesteSteg();
    const forrigeRoute = hentForrigeSteg();
    const nåværendeStegIndex = hentNåværendeStegIndex();
    const formProgressSteg = useFormProgressSteg();

    const nyesteNåværendeRoute: RouteEnum = hentNåværendeSteg().route;

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
        if (modellVersjonOppdatert && !erModellVersjonModalÅpen) {
            åpneModellVersjonModal();
        }
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
        if (komFra) {
            settKomFra(undefined);
        }
        navigate(målPath);
    };

    const håndterGåVidere = event => {
        event.preventDefault();
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

    const dokumentasjonTekster = tekster().DOKUMENTASJON;
    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    const formProgressStegOppsummeringTekst = `${plainTekst(frittståendeOrdTekster.steg)} ${hentNåværendeStegIndex()} ${plainTekst(frittståendeOrdTekster.av)} ${formProgressSteg.length}`;

    const visVedleggOppsummering = vedleggOppsummering && skalVedleggOppsummeringVises(vedleggOppsummering);

    return (
        <>
            <ScrollHandler />
            <InnholdContainer>
                {nyesteNåværendeRoute !== RouteEnum.Kvittering && (
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
                        <Box paddingBlock="space-6 space-6">
                            <Heading level="2" size={'large'} data-testid="steg-tittel">
                                {tittel}
                            </Heading>
                        </Box>
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
                    </div>
                )}
                {guide && (
                    <GuidePanel poster>
                        <TekstBlock block={guide} />
                    </GuidePanel>
                )}
                <form onSubmit={event => håndterGåVidere(event)} autoComplete="off">
                    <VStack gap="space-12">
                        {children}
                        {skjema && visFeiloppsummering(skjema.skjema) && (
                            <SkjemaFeiloppsummering skjema={skjema.skjema} />
                        )}
                        {visVedleggOppsummering && (
                            <Alert variant="info">
                                {plainTekst(dokumentasjonTekster.lastOppSenereISoknad)}
                                <VedleggOppsummering vedlegg={vedleggOppsummering} />
                            </Alert>
                        )}
                        {!erPåKvitteringsside() && (
                            <Navigeringspanel
                                onTilbakeCallback={håndterTilbake}
                                onAvbrytCallback={håndterAvbryt}
                                valideringErOk={skjema && skjema.valideringErOk}
                            />
                        )}
                    </VStack>
                </form>
                {erModellVersjonModalÅpen && <ModellVersjonModal erÅpen={erModellVersjonModalÅpen} />}
            </InnholdContainer>
        </>
    );
};

export default Steg;
