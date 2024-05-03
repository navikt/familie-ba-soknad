import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Accordion, GuidePanel, Heading } from '@navikt/ds-react';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import Miljø from '../../../../shared-utils/Miljø';
import { useApp } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { device } from '../../../Theme';
import { RouteEnum } from '../../../typer/routes';
import { ESanitySteg, Typografi } from '../../../typer/sanity/sanity';
import { logSidevisningBarnetrygd } from '../../../utils/amplitude';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';

import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import FortsettPåSøknad from './FortsettPåSøknad';

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

const Forside: React.FC = () => {
    const { mellomlagretVerdi, søknad, settNåværendeRoute, tekster, plainTekst } = useApp();

    useFørsteRender(() => logSidevisningBarnetrygd(`${RouteEnum.Forside}`, søknad.søknadstype));

    useEffect(() => {
        settNåværendeRoute(RouteEnum.Forside);
        setAvailableLanguages([
            { locale: 'nb', handleInApp: true },
            { locale: 'nn', handleInApp: true },
            { locale: 'en', handleInApp: true },
        ]);
    }, []);

    const kanFortsettePåSøknad =
        mellomlagretVerdi && mellomlagretVerdi.modellVersjon === Miljø().modellVersjon;

    const forsidetekster = tekster()[ESanitySteg.FORSIDE];

    return (
        <Layout>
            <Heading size="xlarge" align={'center'}>
                {plainTekst(forsidetekster.soeknadstittelBarnetrygd)}
            </Heading>
            <GuidePanel poster>
                <TekstBlock block={forsidetekster.veilederHei} typografi={Typografi.HeadingH2} />
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
