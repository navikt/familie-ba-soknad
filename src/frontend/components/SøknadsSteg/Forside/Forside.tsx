import { useTranslate } from '@hooks/useTranslate';
import { Accordion, GuidePanel, Heading } from '@navikt/ds-react';
import { type FC, useEffect } from 'react';
import miljø from '../../../../common/miljø';
import { ESanitySteg, Typografi } from '../../../../common/sanity';
import { useAppContext } from '../../../context/AppContext';
import { useSanityTekster } from '../../../context/SanityContext';
import { useSpråkContext } from '../../../context/SpråkContext';
import { RouteEnum } from '../../../typer/routes';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import styles from './Forside.module.css';
import { FortsettPåSøknad } from './FortsettPåSøknad';

const Forside: FC = () => {
    const { mellomlagretVerdi, settNåværendeRoute } = useAppContext();
    const { visSpråkvelger } = useSpråkContext();

    useEffect(() => {
        settNåværendeRoute(RouteEnum.Forside);
        visSpråkvelger();
    }, []);

    const kanFortsettePåSøknad = mellomlagretVerdi && mellomlagretVerdi.modellVersjon === miljø().modellVersjon;

    const forsidetekster = useSanityTekster(ESanitySteg.FORSIDE);
    const translate = useTranslate();

    return (
        <InnholdContainer>
            <GuidePanel poster>
                <Heading level="2" size="medium" spacing>
                    {translate(forsidetekster.veilederHei)}
                </Heading>
                <TekstBlock block={forsidetekster.veilederIntro} typografi={Typografi.BodyLong} />
            </GuidePanel>
            <div>
                <Heading level="2" size="medium" spacing>
                    {translate(forsidetekster.foerDuSoekerTittel)}
                </Heading>
                <div className={styles.textBlockContainer}>
                    <TekstBlock block={forsidetekster.foerDuSoeker} typografi={Typografi.BodyLong} />
                </div>
            </div>
            <Accordion>
                <Accordion.Item>
                    <Accordion.Header>{translate(forsidetekster.informasjonOmPlikterTittel)}</Accordion.Header>
                    <Accordion.Content>
                        <TekstBlock block={forsidetekster.informasjonOmPlikter} />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>
                        {translate(forsidetekster.informasjonOmPersonopplysningerTittel)}
                    </Accordion.Header>
                    <Accordion.Content>
                        <TekstBlock block={forsidetekster.informasjonOmPersonopplysninger} />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>{translate(forsidetekster.informasjonOmLagringAvSvarTittel)}</Accordion.Header>
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
