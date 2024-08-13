import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { FormSummary } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { useRoutes } from '../../../../context/RoutesContext';
import { useSpråk } from '../../../../context/SpråkContext';
import { RouteEnum } from '../../../../typer/routes';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { genererAdresseVisning } from '../../../../utils/adresse';
import { landkodeTilSpråk } from '../../../../utils/språk';
import { jaNeiSvarTilSpråkId } from '../../../../utils/spørsmål';
import TekstBlock from '../../../Felleskomponenter/Sanity/TekstBlock';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsperiodeOppsummering } from '../../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import {
    omDegPersonopplysningerSpråkId,
    OmDegSpørsmålId,
    omDegSpørsmålSpråkId,
} from '../../OmDeg/spørsmål';
import { useOmdeg } from '../../OmDeg/useOmdeg';
import { OppsummeringFelt } from '../OppsummeringFelt';
import OppsummeringsbolkMedFormSummary from '../OppsummeringsbolkMedFormSummary';
import { StyledOppsummeringsFeltGruppe } from '../OppsummeringsFeltGruppe';

const StyledUtenlandsperiodeOppsummering = styled(UtenlandsperiodeOppsummering)`
    border-bottom: none;
`;

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const OmDegOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster, plainTekst } = useApp();
    const { valgtLocale } = useSpråk();
    const { formatMessage } = useIntl();
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const omDegHook = useOmdeg();
    const forsidetekster = tekster()[ESanitySteg.FORSIDE];

    return (
        <OppsummeringsbolkMedFormSummary
            steg={hentRouteObjektForRouteEnum(RouteEnum.OmDeg)}
            tittel={'omdeg.sidetittel'}
            skjemaHook={omDegHook}
            settFeilAnchors={settFeilAnchors}
        >
            <FormSummary.Answer>
                <FormSummary.Label>
                    <TekstBlock
                        block={forsidetekster.bekreftelsesboksBroedtekst}
                        brukTypografiWrapper={false}
                    />
                </FormSummary.Label>
                <FormSummary.Value>
                    {søknad.lestOgForståttBekreftelse
                        ? plainTekst(forsidetekster.bekreftelsesboksErklaering)
                        : formatMessage({ id: jaNeiSvarTilSpråkId(ESvar.NEI) })}
                </FormSummary.Value>
            </FormSummary.Answer>

            <FormSummary.Answer>
                <FormSummary.Label>
                    <SpråkTekst id={'felles.fødsels-eller-dnummer.label'} />
                </FormSummary.Label>
                <FormSummary.Value>{søknad.søker.ident}</FormSummary.Value>
            </FormSummary.Answer>

            <FormSummary.Answer>
                <FormSummary.Label>
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerStatsborgerskap} />
                </FormSummary.Label>
                {søknad.søker.statsborgerskap.map((statsborgerskap: { landkode: Alpha3Code }) => (
                    <FormSummary.Value>
                        {landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)}
                    </FormSummary.Value>
                ))}
            </FormSummary.Answer>

            <FormSummary.Answer>
                <FormSummary.Label>
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerSivilstatus} />
                </FormSummary.Label>
                <FormSummary.Value>
                    <SpråkTekst id={'felles.sivilstatus.kode.' + søknad.søker.sivilstand.type} />
                </FormSummary.Value>
            </FormSummary.Answer>

            <FormSummary.Answer>
                <FormSummary.Label>
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerAdresse} />
                </FormSummary.Label>
                <FormSummary.Value>{genererAdresseVisning(søknad.søker)}</FormSummary.Value>
            </FormSummary.Answer>

            <StyledOppsummeringsFeltGruppe>
                {søknad.søker.borPåRegistrertAdresse.svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse]}
                            />
                        }
                        søknadsvar={søknad.søker.borPåRegistrertAdresse.svar}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>

            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder]}
                        />
                    }
                    søknadsvar={søknad.søker.værtINorgeITolvMåneder.svar}
                />
                {søknad.søker.utenlandsperioder.map((periode, index) => (
                    <StyledUtenlandsperiodeOppsummering
                        key={index}
                        periode={periode}
                        nummer={index + 1}
                    />
                ))}
                {søknad.søker.planleggerÅBoINorgeTolvMnd.svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omDegSpørsmålSpråkId[OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]
                                }
                            />
                        }
                        søknadsvar={søknad.søker.planleggerÅBoINorgeTolvMnd.svar}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
        </OppsummeringsbolkMedFormSummary>
    );
};

export default OmDegOppsummering;
