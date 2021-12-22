import React from 'react';

import { useIntl } from 'react-intl';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { AlternativtSvarForInput } from '../../../../../typer/common';
import { andreForelderDataKeySpørsmål } from '../../../../../typer/person';
import { IAndreForelder, IBarnMedISøknad } from '../../../../../typer/søknad';
import { formaterDato } from '../../../../../utils/dato';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../../../utils/visning';
import { BorderlessPensjonOppsummering } from '../../../../Felleskomponenter/PensjonModal/PensjonOppsummering';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../../OmBarnet/spørsmål';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';

const AndreForelderOppsummering: React.FC<{
    barnetsNavn: string;
    andreForelder: IAndreForelder;
    barn: IBarnMedISøknad;
}> = ({ barnetsNavn, andreForelder, barn }) => {
    const intl = useIntl();
    const { formatMessage } = intl;
    const [valgtLocale] = useSprakContext();

    return (
        <>
            <StyledOppsummeringsFeltGruppe>
                {andreForelder[andreForelderDataKeySpørsmål.navn].svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarnet.andre-forelder'} />}
                        søknadsvar={
                            andreForelder[andreForelderDataKeySpørsmål.navn].svar !==
                            AlternativtSvarForInput.UKJENT
                                ? andreForelder[andreForelderDataKeySpørsmål.navn].svar
                                : formatMessage({
                                      id: omBarnetSpørsmålSpråkId[
                                          OmBarnetSpørsmålsId.andreForelderNavnUkjent
                                      ],
                                  })
                        }
                    />
                )}
                {andreForelder[andreForelderDataKeySpørsmål.fnr].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFnr]}
                            />
                        }
                        søknadsvar={
                            andreForelder[andreForelderDataKeySpørsmål.fnr].svar !==
                            AlternativtSvarForInput.UKJENT
                                ? andreForelder[andreForelderDataKeySpørsmål.fnr].svar
                                : formatMessage({
                                      id: omBarnetSpørsmålSpråkId[
                                          OmBarnetSpørsmålsId.andreForelderFnrUkjent
                                      ],
                                  })
                        }
                    />
                )}
                {andreForelder[andreForelderDataKeySpørsmål.fødselsdato].svar && (
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
                            andreForelder[andreForelderDataKeySpørsmål.fødselsdato].svar,
                            formatMessage({
                                id: omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent
                                ],
                            })
                        )}
                    />
                )}
                {andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet]
                                            .id
                                    ]
                                }
                                values={{ navn: barnetsNavn }}
                            />
                        }
                        søknadsvar={andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet].svar}
                    />
                )}
                {andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        andreForelder[
                                            andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand
                                        ].id
                                    ]
                                }
                            />
                        }
                        søknadsvar={landkodeTilSpråk(
                            andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand]
                                .svar,
                            valgtLocale
                        )}
                    />
                )}
                {andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].id
                                    ]
                                }
                                values={{ navn: barnetsNavn }}
                            />
                        }
                        søknadsvar={andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar}
                    >
                        {!!andreForelder[andreForelderDataKeySpørsmål.pensjonsperioderUtland]
                            .length && (
                            <OppsummeringFelt tittel={'Perioder med pensjon'}>
                                {andreForelder[
                                    andreForelderDataKeySpørsmål.pensjonsperioderUtland
                                ].map((periode, index) => (
                                    <BorderlessPensjonOppsummering
                                        periode={periode}
                                        nummer={index + 1}
                                        visFjernKnapp={false}
                                        fjernPeriodeCallback={() => null}
                                        barn={barn}
                                    />
                                ))}
                            </OppsummeringFelt>
                        )}
                    </OppsummeringFelt>
                )}
                {andreForelder[andreForelderDataKeySpørsmål.pensjonHvilketLand].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        andreForelder[
                                            andreForelderDataKeySpørsmål.pensjonHvilketLand
                                        ].id
                                    ]
                                }
                                values={{
                                    navn: barnetsNavn,
                                    barn: barnetsNavn,
                                }}
                            />
                        }
                        søknadsvar={landkodeTilSpråk(
                            andreForelder[andreForelderDataKeySpørsmål.pensjonHvilketLand].svar,
                            valgtLocale
                        )}
                    />
                )}
                {andreForelder.utvidet[andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]
                    .svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder
                                    ]
                                }
                                values={{ navn: barnetsNavn }}
                            />
                        }
                        søknadsvar={
                            andreForelder.utvidet[
                                andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder
                            ].svar
                        }
                    />
                )}
                {andreForelder.utvidet[
                    andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato
                ].svar && (
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
                                andreForelder.utvidet[
                                    andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato
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
        </>
    );
};

export default AndreForelderOppsummering;
