import React, { useEffect } from 'react';

import styled from 'styled-components';

import { GuidePanel, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import Miljø from '../../../../shared-utils/Miljø';
import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
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

const Forside: React.FC = () => {
    const { sluttbruker, mellomlagretVerdi, erUtvidet, søknad, settNåværendeRoute, settSøknad } =
        useApp();

    const { toggles } = useFeatureToggles();

    useFørsteRender(() => logSidevisningBarnetrygd(`${RouteEnum.Forside}`));

    useEffect(() => {
        settNåværendeRoute(RouteEnum.Forside);
    }, []);

    const kanFortsettePåSøknad =
        mellomlagretVerdi &&
        mellomlagretVerdi.modellVersjon === Miljø().modellVersjon &&
        mellomlagretVerdi.søknad.søknadstype === søknad.søknadstype;

    const navn = sluttbruker.status === RessursStatus.SUKSESS ? sluttbruker.data.navn : '-';

    return (
        <InnholdContainer>
            <GuidePanel>
                <SpråkTekst id={'forside.veilederhilsen'} values={{ navn: navn.toUpperCase() }} />
            </GuidePanel>
            <StyledHeading size="xlarge">
                <SpråkTekst id={erUtvidet ? 'forside.utvidet.sidetittel' : 'forside.sidetittel'} />
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

            <Informasjonsbolk>
                <SpråkTekst id={'forside.info.punktliste'} values={{ b: msg => <b>{msg}</b> }} />
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
            </Informasjonsbolk>

            {kanFortsettePåSøknad ? (
                <FortsettPåSøknad />
            ) : (
                <>
                    {toggles[EFeatureToggle.KOMBINER_SOKNADER] && (
                        <RadioGroup
                            legend={
                                'Vil du søke om utvidet barnetrygd i tillegg til ordinær barnetrygd?'
                            } // TODO: Skal hente tekster fra Sanity
                            onChange={(value: ESøknadstype) =>
                                settSøknad({ ...søknad, søknadstype: value })
                            }
                        >
                            <Radio value={ESøknadstype.UTVIDET}>Ja</Radio>
                            <Radio value={ESøknadstype.ORDINÆR}>Nei</Radio>
                        </RadioGroup>
                    )}
                    <BekreftelseOgStartSoknad />
                </>
            )}

            <Informasjonsbolk>
                <EksternLenke
                    lenkeSpråkId={'forside.behandling-av-personopplysning.lenke'}
                    lenkeTekstSpråkId={'forside.behandling-av-personopplysning.lenketekst'}
                    target="_blank"
                />
            </Informasjonsbolk>
        </InnholdContainer>
    );
};

export default Forside;
