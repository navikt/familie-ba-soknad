import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { RouteEnum, useRoutes } from '../../../../context/RoutesContext';
import { barnDataKeySpørsmål } from '../../../../typer/person';
import { barnetsNavnValue } from '../../../../utils/barn';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnaDineSpørsmålId, omBarnaDineSpørsmålSpråkId } from '../../OmBarnaDine/spørsmål';
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
            .filter(barn => barn[søknadDatafelt].svar === ESvar.JA)
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
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.erNoenAvBarnaFosterbarn.svar}
                />
                {søknad.erNoenAvBarnaFosterbarn.svar === ESvar.JA && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemErFosterbarn
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erFosterbarn)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.oppholderBarnSegIInstitusjon.svar}
                />

                {søknad.oppholderBarnSegIInstitusjon.svar === ESvar.JA && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(
                            barnDataKeySpørsmål.oppholderSegIInstitusjon
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.erBarnAdoptertFraUtland.svar}
                />
                {søknad.erBarnAdoptertFraUtland.svar === ESvar.JA && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erAdoptertFraUtland)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.oppholderBarnSegIUtland
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.oppholderBarnSegIUtland.svar}
                />
                {søknad.oppholderBarnSegIUtland.svar === ESvar.JA && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemOppholderSegIUtland
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.oppholderSegIUtland)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.søktAsylForBarn]}
                        />
                    }
                    søknadsvar={søknad.søktAsylForBarn.svar}
                />
                {søknad.søktAsylForBarn.svar === ESvar.JA && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemErSøktAsylFor
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erAsylsøker)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar}
                />

                {søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar === ESvar.NEI && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(
                            barnDataKeySpørsmål.boddMindreEnn12MndINorge
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar}
                />

                {søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar === ESvar.JA && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(
                            barnDataKeySpørsmål.barnetrygdFraAnnetEøsland
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            {søknad.erAvdødPartnerForelder.svar && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.erAvdødPartnerForelder
                                    ]
                                }
                            />
                        }
                        søknadsvar={søknad.erAvdødPartnerForelder.svar}
                    />

                    {søknad.erAvdødPartnerForelder.svar === ESvar.JA && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnaDineSpørsmålSpråkId[
                                            OmBarnaDineSpørsmålId.hvemAvdødPartner
                                        ]
                                    }
                                />
                            }
                            søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.andreForelderErDød)}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            )}
        </Oppsummeringsbolk>
    );
};

export default OmBarnaOppsummering;
