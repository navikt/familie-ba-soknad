import React from 'react';

import { useIntl } from 'react-intl';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import {
    AlternativtSvarForInput,
    barnDataKeySpørsmål,
    IBarnMedISøknad,
} from '../../../../../typer/person';
import {
    landkodeTilSpråk,
    barnetsNavnValue,
    formaterDatoMedUkjent,
} from '../../../../../utils/visning';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../../OmBarnet/spørsmål';
import { StyledOppsummeringsFeltGruppe } from '../../Oppsummering';
import { OppsummeringFelt } from '../../OppsummeringFelt';

const AndreForelderOppsummering: React.FC<{ barn: IBarnMedISøknad }> = ({ barn }) => {
    const intl = useIntl();
    const { formatMessage } = intl;
    const [valgtLocale] = useSprakContext();

    return (
        <>
            <StyledOppsummeringsFeltGruppe>
                {barn[barnDataKeySpørsmål.andreForelderNavn].svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarnet.andre-forelder'} />}
                        søknadsvar={
                            barn[barnDataKeySpørsmål.andreForelderNavn].svar !==
                            AlternativtSvarForInput.UKJENT
                                ? barn[barnDataKeySpørsmål.andreForelderNavn].svar
                                : formatMessage({
                                      id:
                                          omBarnetSpørsmålSpråkId[
                                              OmBarnetSpørsmålsId.andreForelderNavnUkjent
                                          ],
                                  })
                        }
                    />
                )}
                {barn[barnDataKeySpørsmål.andreForelderFnr].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFnr]}
                            />
                        }
                        søknadsvar={
                            barn[barnDataKeySpørsmål.andreForelderFnr].svar !==
                            AlternativtSvarForInput.UKJENT
                                ? barn[barnDataKeySpørsmål.andreForelderFnr].svar
                                : formatMessage({
                                      id:
                                          omBarnetSpørsmålSpråkId[
                                              OmBarnetSpørsmålsId.andreForelderFnrUkjent
                                          ],
                                  })
                        }
                    />
                )}
                {barn[barnDataKeySpørsmål.andreForelderFødselsdato].svar && (
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
                            barn[barnDataKeySpørsmål.andreForelderFødselsdato].svar,
                            formatMessage({
                                id:
                                    omBarnetSpørsmålSpråkId[
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
                                    OmBarnetSpørsmålsId.andreForelderArbeidUtlandet
                                ]
                            }
                            values={{ navn: barnetsNavnValue(barn, intl) }}
                        />
                    }
                    søknadsvar={barn[barnDataKeySpørsmål.andreForelderArbeidUtlandet].svar}
                />
                {barn[barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand
                                    ]
                                }
                            />
                        }
                        søknadsvar={landkodeTilSpråk(
                            barn[barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand].svar,
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
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.andreForelderPensjonUtland
                                ]
                            }
                            values={{ navn: barnetsNavnValue(barn, intl) }}
                        />
                    }
                    søknadsvar={barn[barnDataKeySpørsmål.andreForelderPensjonUtland].svar}
                />
                {barn[barnDataKeySpørsmål.andreForelderPensjonHvilketLand].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand
                                    ]
                                }
                                values={{ navn: barnetsNavnValue(barn, intl) }}
                            />
                        }
                        søknadsvar={landkodeTilSpråk(
                            barn[barnDataKeySpørsmål.andreForelderPensjonHvilketLand].svar,
                            valgtLocale
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
        </>
    );
};

export default AndreForelderOppsummering;
