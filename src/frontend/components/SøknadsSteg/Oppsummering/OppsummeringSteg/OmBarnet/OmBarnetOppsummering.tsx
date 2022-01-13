import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useSteg } from '../../../../../context/StegContext';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { andreForelderDataKeySpørsmål, barnDataKeySpørsmål } from '../../../../../typer/person';
import { IBarnMedISøknad } from '../../../../../typer/søknad';
import { barnetsNavnValue } from '../../../../../utils/barn';
import { formaterDato } from '../../../../../utils/dato';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../../../utils/visning';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsperiodeOppsummering } from '../../../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../../OmBarnet/spørsmål';
import { useOmBarnet } from '../../../OmBarnet/useOmBarnet';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';
import AndreForelderOppsummering from './AndreForelderOppsummering';

const StyledUtenlandsperiodeOppsummering = styled(UtenlandsperiodeOppsummering)`
    border-bottom: none;
`;

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    nummer: string;
    barn: IBarnMedISøknad;
    index: number;
}

const OmBarnetOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn, index }) => {
    const intl = useIntl();
    const { formatMessage } = intl;
    const { hentStegObjektForBarn } = useSteg();
    const [valgtLocale] = useSprakContext();

    return (
        <Oppsummeringsbolk
            tittel={'oppsummering.deltittel.ombarnet'}
            språkValues={{ nummer, navn: barnetsNavnValue(barn, intl) }}
            key={index}
            steg={hentStegObjektForBarn(barn)}
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

                    {barn[barnDataKeySpørsmål.institusjonIUtland].svar === ESvar.JA ? (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.institusjonIUtland
                                        ]
                                    }
                                />
                            }
                        />
                    ) : (
                        <>
                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={
                                            omBarnetSpørsmålSpråkId[
                                                OmBarnetSpørsmålsId.institusjonsnavn
                                            ]
                                        }
                                    />
                                }
                                søknadsvar={barn[barnDataKeySpørsmål.institusjonsnavn].svar}
                            />

                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={
                                            omBarnetSpørsmålSpråkId[
                                                OmBarnetSpørsmålsId.institusjonsadresse
                                            ]
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
                        </>
                    )}

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
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={'ombarnet.opplystatbarnutlandopphold.info'}
                                values={{ navn: barnetsNavnValue(barn, intl) }}
                            />
                        }
                    />
                    {barn.utenlandsperioder.map((periode, index) => (
                        <StyledUtenlandsperiodeOppsummering
                            key={index}
                            periode={periode}
                            nummer={index + 1}
                            fjernPeriodeCallback={() => null}
                            visFjernKnapp={false}
                            barn={barn}
                        />
                    ))}
                    {barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd
                                        ]
                                    }
                                    values={{ barn: barnetsNavnValue(barn, intl) }}
                                />
                            }
                            søknadsvar={barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar}
                        />
                    )}
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
            {barn.andreForelder && (
                <AndreForelderOppsummering
                    barnetsNavn={barnetsNavnValue(barn, intl)}
                    andreForelder={barn.andreForelder}
                />
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
                {barn.andreForelder?.[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]
                    .svar && (
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
                        søknadsvar={
                            barn.andreForelder[
                                andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted
                            ].svar
                        }
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
                                //TODO refactor
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
        </Oppsummeringsbolk>
    );
};

export default OmBarnetOppsummering;
