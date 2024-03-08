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
import { logSidevisningBarnetrygd } from '../../../utils/amplitude';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import FamilieAlert from '../../Felleskomponenter/FamilieAlert/FamilieAlert';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
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
    const { sluttbruker, mellomlagretVerdi, søknad, settNåværendeRoute } = useApp();

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
            <Heading size="xlarge" align={'center'} /* todo legg til tekst i sanity */>
                Søknad om barnetrygd
            </Heading>
            <StyledSpråkvelger støttedeSprak={[LocaleType.nn, LocaleType.nb, LocaleType.en]} />
            <GuidePanel poster /* todo legg til tekst i sanity*/>
                <BodyShort weight="semibold">Hei, TODO TODOSEN!</BodyShort>
                <BodyShort /* dette innholdet skal inn i sanity! alt sammen. blir vel en tekstblock*/
                >
                    Jeg er her for å veilede deg gjennom søknaden.
                </BodyShort>
                <ul>
                    <li>Du må svare på alle spørsmål på hver side for å komme videre.</li>
                    <li>
                        Vi lagrer søknaden din ut morgendagen. Derfor kan du ta pauser når du fyller
                        ut.{' '}
                    </li>
                    <li>Du kan avbryte søknaden og slette opplysningene du har lagt inn.</li>
                    <li>
                        Du må bekrefte at du har lest og forstått pliktene dine for å fortsette med
                        søknaden.
                    </li>
                </ul>
            </GuidePanel>
            <StyledAccordion size={'large'}>
                <Accordion.Item>
                    <Accordion.Header>Hvis du får barnetrygd gjelder dette</Accordion.Header>
                    <Accordion.Content>
                        For at du skal få utbetalt riktig beløp fra NAV, er vi avhengig av at du gir
                        oss riktige opplysninger og melder fra når det skjer endringer i
                        livssituasjonen din.
                        <EksternLenke
                            lenkeSpråkId={'forside.plikter.lenke'}
                            lenkeTekstSpråkId={'forside.plikter.lenketekst'}
                            target="_blank"
                        />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>Vi vil hente og bruke informasjon om deg</Accordion.Header>
                    <Accordion.Content>
                        <BodyShort /* dette blir en tekstblock fra sanity*/>
                            I tillegg til den informasjonen du oppgir i søknaden, henter vi:
                        </BodyShort>
                        <ul>
                            <li>personinformasjon om deg og barna dine fra Folkeregisteret</li>
                            <li>opplysninger om deg vi har fra før</li>
                        </ul>
                        <BodyShort>
                            Dette gjør vi for å vurdere om du har rett til barnetrygd.
                        </BodyShort>
                        <EksternLenke
                            lenkeSpråkId={'forside.behandling-av-personopplysning.lenke'}
                            lenkeTekstSpråkId={'forside.behandling-av-personopplysning.lenketekst'}
                            target="_blank"
                        />
                    </Accordion.Content>
                </Accordion.Item>
            </StyledAccordion>
            {kanFortsettePåSøknad ? <FortsettPåSøknad /> : <BekreftelseOgStartSoknad />}
        </Layout>
    );
};

export default Forside;
