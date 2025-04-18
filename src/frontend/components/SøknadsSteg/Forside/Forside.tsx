import React, { useEffect } from 'react';

import { Accordion, GuidePanel, Heading } from '@navikt/ds-react';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import Miljø from '../../../../shared-utils/Miljø';
import { useAppContext } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { RouteEnum } from '../../../typer/routes';
import { ESanitySteg, Typografi } from '../../../typer/sanity/sanity';
import { logSidevisningBarnetrygd } from '../../../utils/amplitude';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';

import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import { FortsettPåSøknad } from './FortsettPåSøknad';

const Forside: React.FC = () => {
    const { mellomlagretVerdi, søknad, settNåværendeRoute, tekster, plainTekst } = useAppContext();

    useFørsteRender(() => logSidevisningBarnetrygd(`${RouteEnum.Forside}`, søknad.søknadstype));

    useEffect(() => {
        settNåværendeRoute(RouteEnum.Forside);
        visSpråkvelger();
    }, []);

    const visSpråkvelger = () => {
        setAvailableLanguages([
            { locale: 'nb', handleInApp: true },
            { locale: 'nn', handleInApp: true },
            { locale: 'en', handleInApp: true },
        ]).then();
    };

    const kanFortsettePåSøknad =
        mellomlagretVerdi && mellomlagretVerdi.modellVersjon === Miljø().modellVersjon;

    const forsidetekster = tekster()[ESanitySteg.FORSIDE];

    return (
        <InnholdContainer>
            <GuidePanel poster>
                <Heading level="2" size="medium" spacing>
                    {plainTekst(forsidetekster.veilederHei)}
                </Heading>
                <TekstBlock block={forsidetekster.veilederIntro} typografi={Typografi.BodyLong} />
            </GuidePanel>
            <div>
                <Heading level="2" size="medium" spacing>
                    {plainTekst(forsidetekster.foerDuSoekerTittel)}
                </Heading>
                <TekstBlock block={forsidetekster.foerDuSoeker} typografi={Typografi.BodyLong} />
            </div>
            <Accordion>
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
                <Accordion.Item>
                    <Accordion.Header>
                        {plainTekst(forsidetekster.informasjonOmLagringAvSvarTittel)}
                    </Accordion.Header>
                    <Accordion.Content>
                        <TekstBlock block={forsidetekster.informasjonOmLagringAvSvar} />
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
            {kanFortsettePåSøknad ? <FortsettPåSøknad /> : <BekreftelseOgStartSoknad />}
        </InnholdContainer>
    );
};

export default Forside;
