import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Accordion, BodyShort, GuidePanel, Heading } from '@navikt/ds-react';
import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import Miljø from '../../../../shared-utils/Miljø';
import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { device } from '../../../Theme';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { RouteEnum } from '../../../typer/routes';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { logSidevisningBarnetrygd } from '../../../utils/amplitude';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import FamilieAlert from '../../Felleskomponenter/FamilieAlert/FamilieAlert';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import FortsettPåSøknad from './FortsettPåSøknad';

const StyledHeading = styled(Heading)`
    && {
        margin: 4rem 0 2.3rem 0;
    }
`;

const StyledSpråkvelger = styled(Sprakvelger)`
    margin: auto;
`;

const StyledAlertStripeUtvidetInfo = styled(FamilieAlert)`
    margin-top: 3rem;
`;

const StyledAccordion = styled(Accordion)`
    width: 100%;
`;

const Layout = styled.div`
    max-width: var(--innhold-bredde);
    display: grid;
    gap: 3rem;
    margin: 2rem auto 4rem auto;

    @media all and ${device.tablet} {
        max-width: 100%;
        margin: 2rem 2rem 4rem 2rem;
    }
`;

const StyledInformasjonsbolk = styled(Informasjonsbolk)`
    margin-bottom: 3rem;
`;

const Forside: React.FC = () => {
    const { sluttbruker, mellomlagretVerdi, søknad, settNåværendeRoute, tekster, plainTekst } =
        useApp();

    const { toggles } = useFeatureToggles();
    const kombinerSøknaderToggle = toggles[EFeatureToggle.KOMBINER_SOKNADER];

    const erUtvidet =
        kombinerSøknaderToggle && mellomlagretVerdi
            ? mellomlagretVerdi.søknad.søknadstype === ESøknadstype.UTVIDET
            : søknad.søknadstype === ESøknadstype.UTVIDET;

    useFørsteRender(() => logSidevisningBarnetrygd(`${RouteEnum.Forside}`));

    useEffect(() => {
        settNåværendeRoute(RouteEnum.Forside);
    }, []);

    const kanFortsettePåSøknad =
        mellomlagretVerdi &&
        mellomlagretVerdi.modellVersjon === Miljø().modellVersjon &&
        (kombinerSøknaderToggle || mellomlagretVerdi.søknad.søknadstype === søknad.søknadstype);

    const navn = sluttbruker.status === RessursStatus.SUKSESS ? sluttbruker.data.navn : '-';

    const forsidetekster = tekster()[ESanitySteg.FORSIDE];

    if (!kombinerSøknaderToggle) {
        return (
            <InnholdContainer>
                <GuidePanel>
                    <SpråkTekst
                        id={'forside.veilederhilsen'}
                        values={{ navn: navn.toUpperCase() }}
                    />
                </GuidePanel>
                <StyledHeading size="xlarge">
                    <SpråkTekst
                        id={erUtvidet ? 'forside.utvidet.sidetittel' : 'forside.sidetittel'}
                    />
                </StyledHeading>

                <StyledSpråkvelger støttedeSprak={[LocaleType.nn, LocaleType.nb, LocaleType.en]} />

                {!erUtvidet && (
                    <StyledAlertStripeUtvidetInfo variant={'info'} inline={false}>
                        <SpråkTekst id={'forside.utvidetinfo.info'} />
                        <EksternLenke
                            lenkeSpråkId={'forside.utvidetinfo.lenke'}
                            lenkeTekstSpråkId={'forside.utvidetinfo.lenketekst'}
                            target="_blank"
                        />
                    </StyledAlertStripeUtvidetInfo>
                )}

                <StyledInformasjonsbolk>
                    <SpråkTekst
                        id={'forside.info.punktliste'}
                        values={{ b: msg => <b>{msg}</b> }}
                    />
                    <EksternLenke
                        lenkeSpråkId={'forside.plikter.lenke'}
                        lenkeTekstSpråkId={'forside.plikter.lenketekst'}
                        target="_blank"
                    />
                    {erUtvidet && (
                        <EksternLenke
                            lenkeSpråkId={'forside.hvemharrettpåutvidet.lenke'}
                            lenkeTekstSpråkId={'forside.hvemharrettpåutvidet.lenketekst'}
                            target="_blank"
                        />
                    )}
                </StyledInformasjonsbolk>

                {kanFortsettePåSøknad ? <FortsettPåSøknad /> : <BekreftelseOgStartSoknad />}

                <Informasjonsbolk>
                    <EksternLenke
                        lenkeSpråkId={'forside.behandling-av-personopplysning.lenke'}
                        lenkeTekstSpråkId={'forside.behandling-av-personopplysning.lenketekst'}
                        target="_blank"
                    />
                </Informasjonsbolk>
            </InnholdContainer>
        );
    }
    return (
        <Layout>
            <Heading size="xlarge" align={'center'}>
                {plainTekst(forsidetekster.soeknadstittelBarnetrygd)}
            </Heading>
            <StyledSpråkvelger støttedeSprak={[LocaleType.nn, LocaleType.nb, LocaleType.en]} />
            <GuidePanel poster>
                <BodyShort weight="semibold">{plainTekst(forsidetekster.veilederHei)}</BodyShort>
                <TekstBlock block={forsidetekster.veilederIntro} />
            </GuidePanel>
            <StyledAccordion size={'large'}>
                <Accordion.Item>
                    <Accordion.Header>
                        {plainTekst(forsidetekster.informasjonOmPlikterTittel)}
                    </Accordion.Header>
                    <Accordion.Content>
                        <TekstBlock block={forsidetekster.informasjonOmPlikter} />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>
                        {plainTekst(forsidetekster.informasjonOmPersonopplysningerTittel)}
                    </Accordion.Header>
                    <Accordion.Content>
                        <TekstBlock block={forsidetekster.informasjonOmPersonopplysninger} />
                    </Accordion.Content>
                </Accordion.Item>
            </StyledAccordion>
            {kanFortsettePåSøknad ? <FortsettPåSøknad /> : <BekreftelseOgStartSoknad />}
        </Layout>
    );
};

export default Forside;
