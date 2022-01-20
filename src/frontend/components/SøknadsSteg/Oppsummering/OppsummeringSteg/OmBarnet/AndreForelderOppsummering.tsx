import React from 'react';

import { useIntl } from 'react-intl';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useFeatureToggles } from '../../../../../context/FeatureToggleContext';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { andreForelderDataKeySpørsmål } from '../../../../../typer/person';
import { IAndreForelder } from '../../../../../typer/søknad';
import { formaterDato } from '../../../../../utils/dato';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../../../utils/visning';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
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
    const { toggles } = useFeatureToggles();

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
                {toggles.EØS_KOMPLETT ? (
                    <>
                        {andreForelder[
                            andreForelderDataKeySpørsmål.arbeidsperiodeUtlandAndreForelder
                        ].map((periode, index) => (
                            <ArbeidsperiodeOppsummering
                                key={index}
                                nummer={index + 1}
                                arbeidsperiode={periode}
                            />
                        ))}
                    </>
                ) : (
                    <>
                        {andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand]
                            .svar && (
                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={
                                            omBarnetSpørsmålSpråkId[
                                                andreForelder[
                                                    andreForelderDataKeySpørsmål
                                                        .arbeidUtlandetHvilketLand
                                                ].id
                                            ]
                                        }
                                    />
                                }
                                søknadsvar={landkodeTilSpråk(
                                    andreForelder[
                                        andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand
                                    ].svar,
                                    valgtLocale
                                )}
                            />
                        )}
                    </>
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
                    />
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
