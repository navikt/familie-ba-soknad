import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useRoutes } from '../../../../../context/RoutesContext';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { barnDataKeySpørsmål, barnDataKeySpørsmålUtvidet } from '../../../../../typer/person';
import { IBarnMedISøknad } from '../../../../../typer/søknad';
import { barnetsNavnValue } from '../../../../../utils/barn';
import { formaterDato } from '../../../../../utils/dato';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../../../utils/visning';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../../OmBarnet/spørsmål';
import { useOmBarnet } from '../../../OmBarnet/useOmBarnet';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';
import AndreForelderOppsummering from './AndreForelderOppsummering';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    nummer: string;
    barn: IBarnMedISøknad;
    index: number;
}

const OmBarnetOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn, index }) => {
    const intl = useIntl();
    const { formatMessage } = intl;
    const { hentStegObjektForBarn } = useRoutes();
    const [valgtLocale] = useSprakContext();

    return (
        <Oppsummeringsbolk
            tittel={'oppsummering.deltittel.ombarnet'}
            språkValues={{ nummer, navn: barnetsNavnValue(barn, intl) }}
            key={index}
            route={hentStegObjektForBarn(barn)}
            skjemaHook={useOmBarnet}
            barnId={barn.id}
            settFeilAnchors={settFeilAnchors}
        >
            {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={'ombarnet.fosterbarn'}
                            values={{ navn: barnetsNavnValue(barn, intl) }}
                        />
                    }
                />
            )}
            {barn[barnDataKeySpørsmål.oppholderSegIInstitusjon].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={'ombarnet.institusjon'}
                                values={{ navn: barnetsNavnValue(barn, intl) }}
                            />
                        }
                    />

                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonsnavn]}
                            />
                        }
                        søknadsvar={barn[barnDataKeySpørsmål.institusjonsnavn].svar}
                    />

                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonsadresse]
                                }
                            />
                        }
                        søknadsvar={barn[barnDataKeySpørsmål.institusjonsadresse].svar}
                    />

                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.institusjonspostnummer
                                    ]
                                }
                            />
                        }
                        søknadsvar={barn[barnDataKeySpørsmål.institusjonspostnummer].svar}
                    />

                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.institusjonOppholdStartdato
                                    ]
                                }
                            />
                        }
                        søknadsvar={formaterDato(
                            barn[barnDataKeySpørsmål.institusjonOppholdStartdato].svar
                        )}
                    />

                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.institusjonOppholdSluttdato
                                    ]
                                }
                            />
                        }
                        søknadsvar={formaterDatoMedUkjent(
                            barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar,
                            formatMessage({
                                id: omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.institusjonOppholdVetIkke
                                ],
                            })
                        )}
                    />
                </StyledOppsummeringsFeltGruppe>
            )}
            {barn[barnDataKeySpørsmål.oppholderSegIUtland].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={'ombarnet.oppholdutland'}
                                values={{ navn: barnetsNavnValue(barn, intl) }}
                            />
                        }
                    />
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.oppholdsland]}
                                values={{ navn: barnetsNavnValue(barn, intl) }}
                            />
                        }
                        søknadsvar={landkodeTilSpråk(
                            barn[barnDataKeySpørsmål.oppholdsland].svar,
                            valgtLocale
                        )}
                    />

                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.oppholdslandStartdato
                                    ]
                                }
                            />
                        }
                        søknadsvar={formaterDato(
                            barn[barnDataKeySpørsmål.oppholdslandStartdato].svar
                        )}
                    />

                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.oppholdslandSluttdato
                                    ]
                                }
                            />
                        }
                        søknadsvar={formaterDatoMedUkjent(
                            barn[barnDataKeySpørsmål.oppholdslandSluttdato].svar,
                            formatMessage({
                                id: omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.oppholdslandSluttDatoVetIkke
                                ],
                            })
                        )}
                    />
                </StyledOppsummeringsFeltGruppe>
            )}
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={'ombarnet.sammenhengende-opphold'}
                                values={{ navn: barnetsNavnValue(barn, intl) }}
                            />
                        }
                    />
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.nårKomBarnetTilNorge
                                    ]
                                }
                            />
                        }
                        søknadsvar={formaterDatoMedUkjent(
                            barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato].svar,
                            formatMessage({
                                id: omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.nårKomBarnetTilNorgeIkkeAnkommet
                                ],
                            })
                        )}
                    />
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd
                                    ]
                                }
                            />
                        }
                        søknadsvar={barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar}
                    />
                </StyledOppsummeringsFeltGruppe>
            )}
            {barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={'ombarnet.barnetrygd-eøs'}
                                values={{ navn: barnetsNavnValue(barn, intl) }}
                            />
                        }
                    />
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand
                                    ]
                                }
                            />
                        }
                        søknadsvar={landkodeTilSpråk(
                            barn[barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand].svar,
                            valgtLocale
                        )}
                    />
                </StyledOppsummeringsFeltGruppe>
            )}
            {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI && (
                <AndreForelderOppsummering barn={barn} />
            )}
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt tittel={<SpråkTekst id={'ombarnet.bosted'} />} />

                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.borFastMedSøker]}
                            values={{ navn: barnetsNavnValue(barn, intl) }}
                        />
                    }
                    søknadsvar={barn[barnDataKeySpørsmål.borFastMedSøker].svar}
                />
                {barn[barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted
                                    ]
                                }
                                values={{ navn: barnetsNavnValue(barn, intl) }}
                            />
                        }
                        søknadsvar={barn[barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted].svar}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.søkerForTidsrom]}
                            values={{ navn: barnetsNavnValue(barn, intl) }}
                        />
                    }
                    søknadsvar={barn[barnDataKeySpørsmål.søkerForTidsrom].svar}
                />

                {barn[barnDataKeySpørsmål.søkerForTidsrom].svar === ESvar.JA && (
                    <>
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.søkerForTidsromStartdato
                                        ]
                                    }
                                />
                            }
                            søknadsvar={formaterDato(
                                barn[barnDataKeySpørsmål.søkerForTidsromStartdato].svar
                            )}
                        />
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.søkerForTidsromSluttdato
                                        ]
                                    }
                                />
                            }
                            søknadsvar={(() => {
                                const svar =
                                    barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar;
                                return svar === AlternativtSvarForInput.UKJENT
                                    ? formatMessage({
                                          id: omBarnetSpørsmålSpråkId[
                                              OmBarnetSpørsmålsId.søkerForTidsromSluttdatoVetIkke
                                          ],
                                      })
                                    : formaterDato(svar);
                            })()}
                        />
                    </>
                )}
            </StyledOppsummeringsFeltGruppe>
            {barn.utvidet[barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder].svar && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder
                                    ]
                                }
                                values={{ navn: barnetsNavnValue(barn, intl) }}
                            />
                        }
                        søknadsvar={
                            barn.utvidet[barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder]
                                .svar
                        }
                    />
                    {barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato]
                        .svar && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato
                                        ]
                                    }
                                />
                            }
                            søknadsvar={(() => {
                                const svar =
                                    barn.utvidet[
                                        barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato
                                    ].svar;
                                return svar === AlternativtSvarForInput.UKJENT
                                    ? formatMessage({
                                          id: omBarnetSpørsmålSpråkId[
                                              OmBarnetSpørsmålsId.søkerBorMedAndreForelder
                                          ],
                                      })
                                    : formaterDato(svar);
                            })()}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            )}
        </Oppsummeringsbolk>
    );
};

export default OmBarnetOppsummering;
