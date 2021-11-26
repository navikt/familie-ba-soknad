import React from 'react';

import { useIntl } from 'react-intl';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { AlternativtSvarForInput } from '../../../../../typer/common';
import { andreForelderDataKeySpørsmål } from '../../../../../typer/person';
import { IAndreForelder } from '../../../../../typer/søknad';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../../../utils/visning';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../../OmBarnet/spørsmål';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';

const AndreForelderOppsummering: React.FC<{
    barnetsNavn: string;
    andreForelder: IAndreForelder;
}> = ({ barnetsNavn, andreForelder }) => {
    const intl = useIntl();
    const { formatMessage } = intl;
    const [valgtLocale] = useSprakContext();

    return (
        <>
            <StyledOppsummeringsFeltGruppe>
                {andreForelder[andreForelderDataKeySpørsmål.andreForelderNavn].svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarnet.andre-forelder'} />}
                        søknadsvar={
                            andreForelder[andreForelderDataKeySpørsmål.andreForelderNavn].svar !==
                            AlternativtSvarForInput.UKJENT
                                ? andreForelder[andreForelderDataKeySpørsmål.andreForelderNavn].svar
                                : formatMessage({
                                      id: omBarnetSpørsmålSpråkId[
                                          OmBarnetSpørsmålsId.andreForelderNavnUkjent
                                      ],
                                  })
                        }
                    />
                )}
                {andreForelder[andreForelderDataKeySpørsmål.andreForelderFnr].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFnr]}
                            />
                        }
                        søknadsvar={
                            andreForelder[andreForelderDataKeySpørsmål.andreForelderFnr].svar !==
                            AlternativtSvarForInput.UKJENT
                                ? andreForelder[andreForelderDataKeySpørsmål.andreForelderFnr].svar
                                : formatMessage({
                                      id: omBarnetSpørsmålSpråkId[
                                          OmBarnetSpørsmålsId.andreForelderFnrUkjent
                                      ],
                                  })
                        }
                    />
                )}
                {andreForelder[andreForelderDataKeySpørsmål.andreForelderFødselsdato].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.andreForelderFødselsdato
                                    ]
                                }
                            />
                        }
                        søknadsvar={formaterDatoMedUkjent(
                            andreForelder[andreForelderDataKeySpørsmål.andreForelderFødselsdato]
                                .svar,
                            formatMessage({
                                id: omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent
                                ],
                            })
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnetSpørsmålSpråkId[
                                    andreForelder.andreForelderArbeidUtlandet.id
                                ]
                            }
                            values={{ navn: barnetsNavn }}
                        />
                    }
                    søknadsvar={
                        andreForelder[andreForelderDataKeySpørsmål.andreForelderArbeidUtlandet].svar
                    }
                />
                {andreForelder[andreForelderDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand]
                    .svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        andreForelder.andreForelderArbeidUtlandetHvilketLand.id
                                    ]
                                }
                            />
                        }
                        søknadsvar={landkodeTilSpråk(
                            andreForelder[
                                andreForelderDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand
                            ].svar,
                            valgtLocale
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnetSpørsmålSpråkId[andreForelder.andreForelderPensjonUtland.id]
                            }
                            values={{ navn: barnetsNavn }}
                        />
                    }
                    søknadsvar={
                        andreForelder[andreForelderDataKeySpørsmål.andreForelderPensjonUtland].svar
                    }
                />
                {andreForelder[andreForelderDataKeySpørsmål.andreForelderPensjonHvilketLand]
                    .svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        andreForelder.andreForelderPensjonHvilketLand.id
                                    ]
                                }
                                values={{
                                    navn: barnetsNavn,
                                    barn: barnetsNavn,
                                }}
                            />
                        }
                        søknadsvar={landkodeTilSpråk(
                            andreForelder[
                                andreForelderDataKeySpørsmål.andreForelderPensjonHvilketLand
                            ].svar,
                            valgtLocale
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
        </>
    );
};

export default AndreForelderOppsummering;
