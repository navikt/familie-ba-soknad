import React, { useEffect } from 'react';

import { Accordion, GuidePanel, Heading } from '@navikt/ds-react';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import { modellVersjon } from '../../../../common/modellversjon';
import { useAppContext } from '../../../context/AppContext';
import { RouteEnum } from '../../../typer/routes';
import { ESanitySteg, Typografi } from '../../../typer/sanity/sanity';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';

import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import { FortsettPåSøknad } from './FortsettPåSøknad';

const Forside: React.FC = () => {
    const { mellomlagretVerdi, settNåværendeRoute, tekster, plainTekst } = useAppContext();

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

    const kanFortsettePåSøknad = mellomlagretVerdi && mellomlagretVerdi.modellVersjon === modellVersjon;

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
                    <Accordion.Header>{plainTekst(forsidetekster.informasjonOmPlikterTittel)}</Accordion.Header>
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
                    <Accordion.Header>{plainTekst(forsidetekster.informasjonOmLagringAvSvarTittel)}</Accordion.Header>
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
