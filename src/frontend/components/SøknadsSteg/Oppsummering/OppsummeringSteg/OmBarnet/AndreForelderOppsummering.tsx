import React from 'react';

import { useIntl } from 'react-intl';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { AlternativtSvarForInput } from '../../../../../typer/common';
import { barnDataKeySpørsmål } from '../../../../../typer/person';
import { IBarnMedISøknad } from '../../../../../typer/søknad';
import { barnetsNavnValue } from '../../../../../utils/barn';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../../../utils/visning';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../../OmBarnet/spørsmål';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';

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
                                      id: omBarnetSpørsmålSpråkId[
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
                                      id: omBarnetSpørsmålSpråkId[
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
                            id={omBarnetSpørsmålSpråkId[barn.andreForelderArbeidUtlandet.id]}
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
                                        barn.andreForelderArbeidUtlandetHvilketLand.id
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
                            id={omBarnetSpørsmålSpråkId[barn.andreForelderPensjonUtland.id]}
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
                                    omBarnetSpørsmålSpråkId[barn.andreForelderPensjonHvilketLand.id]
                                }
                                values={{
                                    navn: barnetsNavnValue(barn, intl),
                                    barn: barnetsNavnValue(barn, intl),
                                }}
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
