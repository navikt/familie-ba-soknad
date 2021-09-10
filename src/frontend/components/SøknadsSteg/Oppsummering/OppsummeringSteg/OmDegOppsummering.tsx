import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../../context/AppContext';
import { RouteEnum, useRoutes } from '../../../../context/RoutesContext';
import { formaterDato } from '../../../../utils/dato';
import { jaNeiSvarTilSpråkId } from '../../../../utils/spørsmål';
import { genererAdresseVisning, landkodeTilSpråk } from '../../../../utils/visning';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import {
    omDegPersonopplysningerSpråkId,
    OmDegSpørsmålId,
    omDegSpørsmålSpråkId,
} from '../../OmDeg/spørsmål';
import { useOmdeg } from '../../OmDeg/useOmdeg';
import { StyledOppsummeringsFeltGruppe } from '../Oppsummering';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const OmDegOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { hentStegObjektForRoute } = useRoutes();
    const { søknad } = useApp();
    const [valgtLocale] = useSprakContext();
    const { formatMessage } = useIntl();

    return (
        <Oppsummeringsbolk
            route={hentStegObjektForRoute(RouteEnum.OmDeg)}
            tittel={'omdeg.sidetittel'}
            skjemaHook={useOmdeg}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'forside.bekreftelsesboks.brødtekst'} />}
                    søknadsvar={formatMessage({
                        id: søknad.lestOgForståttBekreftelse
                            ? 'forside.bekreftelsesboks.erklæring.spm'
                            : jaNeiSvarTilSpråkId(ESvar.NEI),
                    })}
                />
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'felles.fødsels-eller-dnummer.label'} />}
                    søknadsvar={søknad.søker.ident}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={omDegPersonopplysningerSpråkId.søkerStatsborgerskap} />}
                    søknadsvar={søknad.søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                        )
                        .join(', ')}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={omDegPersonopplysningerSpråkId.søkerSivilstatus} />}
                    søknadsvar={søknad.søker.sivilstand.type}
                />

                <OppsummeringFelt
                    tittel={<SpråkTekst id={omDegPersonopplysningerSpråkId.søkerAdresse} />}
                    children={genererAdresseVisning(søknad.søker)}
                />
            </StyledOppsummeringsFeltGruppe>

            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst id={omDegSpørsmålSpråkId[OmDegSpørsmålId.oppholderSegINorge]} />
                    }
                    søknadsvar={søknad.søker.oppholderSegINorge.svar}
                />
                {søknad.søker.oppholdsland.svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={omDegSpørsmålSpråkId[OmDegSpørsmålId.søkerOppholdsland]}
                            />
                        }
                        søknadsvar={landkodeTilSpråk(søknad.søker.oppholdsland.svar, valgtLocale)}
                    />
                )}
                {søknad.søker.oppholdslandDato.svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={omDegSpørsmålSpråkId[OmDegSpørsmålId.oppholdslandDato]}
                            />
                        }
                        søknadsvar={formaterDato(søknad.søker.oppholdslandDato.svar)}
                    />
                )}

                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder]}
                        />
                    }
                    søknadsvar={søknad.søker.værtINorgeITolvMåneder.svar}
                />
                {søknad.søker.komTilNorgeDato.svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={omDegSpørsmålSpråkId[OmDegSpørsmålId.komTilNorgeDato]}
                            />
                        }
                        søknadsvar={formaterDato(søknad.søker.komTilNorgeDato.svar)}
                    />
                )}
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
                <OppsummeringFelt
                    tittel={<SpråkTekst id={omDegSpørsmålSpråkId[OmDegSpørsmålId.erAsylsøker]} />}
                    søknadsvar={søknad.søker.erAsylsøker.svar}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={omDegSpørsmålSpråkId[OmDegSpørsmålId.jobberPåBåt]} />}
                    søknadsvar={søknad.søker.jobberPåBåt.svar}
                />
                {søknad.søker.arbeidsland.svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst id={omDegSpørsmålSpråkId[OmDegSpørsmålId.arbeidsland]} />
                        }
                        søknadsvar={landkodeTilSpråk(søknad.søker.arbeidsland.svar, valgtLocale)}
                    />
                )}
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={omDegSpørsmålSpråkId[OmDegSpørsmålId.mottarUtenlandspensjon]}
                        />
                    }
                    søknadsvar={søknad.søker.mottarUtenlandspensjon.svar}
                />
                {søknad.søker.pensjonsland.svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst id={omDegSpørsmålSpråkId[OmDegSpørsmålId.pensjonsland]} />
                        }
                        søknadsvar={landkodeTilSpråk(søknad.søker.pensjonsland.svar, valgtLocale)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default OmDegOppsummering;
