import React from 'react';

import { useIntl } from 'react-intl';

import { useApp } from '../../../../context/AppContext';
import { RouteEnum, useRoutes } from '../../../../context/RoutesContext';
import { barnDataKeySpørsmål } from '../../../../typer/person';
import { barnetsNavnValue } from '../../../../utils/visning';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { useOmBarnaDine } from '../../OmBarnaDine/useOmBarnaDine';
import { StyledOppsummeringsFeltGruppe } from '../Oppsummering';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const OmBarnaOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const intl = useIntl();
    const { søknad } = useApp();
    const { hentStegObjektForRoute } = useRoutes();

    const genererListeMedBarn = (søknadDatafelt: barnDataKeySpørsmål) =>
        søknad.barnInkludertISøknaden
            .filter(barn => barn[søknadDatafelt].svar === 'JA')
            .map(filtrertBarn => barnetsNavnValue(filtrertBarn, intl))
            .join(', ');

    return (
        <Oppsummeringsbolk
            route={hentStegObjektForRoute(RouteEnum.OmBarna)}
            tittel={'ombarna.sidetittel'}
            skjemaHook={useOmBarnaDine}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'ombarna.fosterbarn.spm'} />}
                    søknadsvar={søknad.erNoenAvBarnaFosterbarn.svar}
                />
                {søknad.erNoenAvBarnaFosterbarn.svar === 'JA' && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.fosterbarn.hvem.spm'} />}
                        søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erFosterbarn)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'ombarna.institusjon.spm'} />}
                    søknadsvar={søknad.oppholderBarnSegIInstitusjon.svar}
                />

                {søknad.oppholderBarnSegIInstitusjon.svar === 'JA' && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.institusjon.hvem.spm'} />}
                        søknadsvar={genererListeMedBarn(
                            barnDataKeySpørsmål.oppholderSegIInstitusjon
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'ombarna.adoptert.spm'} />}
                    søknadsvar={søknad.erBarnAdoptertFraUtland.svar}
                />
                {søknad.erBarnAdoptertFraUtland.svar === 'JA' && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.adoptert.hvem.spm'} />}
                        søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erAdoptertFraUtland)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'ombarna.opphold-utland.spm'} />}
                    søknadsvar={søknad.oppholderBarnSegIUtland.svar}
                />
                {søknad.oppholderBarnSegIUtland.svar === 'JA' && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.opphold-utland.hvem.spm'} />}
                        søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.oppholderSegIUtland)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'ombarna.asyl.spm'} />}
                    søknadsvar={søknad.søktAsylForBarn.svar}
                />
                {søknad.søktAsylForBarn.svar === 'JA' && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.asyl.hvem.spm'} />}
                        søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erAsylsøker)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'ombarna.sammenhengende-opphold.spm'} />}
                    søknadsvar={søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar}
                />

                {søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar === 'NEI' && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.sammenhengende-opphold.hvem.spm'} />}
                        søknadsvar={genererListeMedBarn(
                            barnDataKeySpørsmål.boddMindreEnn12MndINorge
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'ombarna.barnetrygd-eøs.spm'} />}
                    søknadsvar={søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar}
                />

                {søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar === 'JA' && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.barnetrygd-eøs.hvem.spm'} />}
                        søknadsvar={genererListeMedBarn(
                            barnDataKeySpørsmål.barnetrygdFraAnnetEøsland
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default OmBarnaOppsummering;
