import React from 'react';

import { useIntl } from 'react-intl';

import { BodyShort, FormSummary } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { PersonType } from '../../../../../typer/personType';
import { formaterDato } from '../../../../../utils/dato';
import { formaterDatoMedUkjent } from '../../../../../utils/visning';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../../OmBarnet/spørsmål';
import { OppsummeringFelt } from '../../OppsummeringFelt';

const AndreForelderOppsummering: React.FC<{
    barn: IBarnMedISøknad;
    andreForelder: IAndreForelder;
}> = ({ barn, andreForelder }) => {
    const intl = useIntl();
    const { formatMessage } = intl;

    return (
        <FormSummary.Answers>
            {andreForelder[andreForelderDataKeySpørsmål.kanIkkeGiOpplysninger].svar ===
            ESvar.NEI ? (
                <>
                    {andreForelder[andreForelderDataKeySpørsmål.navn].svar && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.andreForelderNavn
                                        ]
                                    }
                                />
                            }
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.navn].svar !==
                                AlternativtSvarForInput.UKJENT
                                    ? andreForelder[andreForelderDataKeySpørsmål.navn].svar
                                    : formatMessage({
                                          id: omBarnetSpørsmålSpråkId[
                                              OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger
                                          ],
                                      })
                            }
                        />
                    )}
                    {andreForelder[andreForelderDataKeySpørsmål.fnr].svar && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.andreForelderFnr
                                        ]
                                    }
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
                                            andreForelder[
                                                andreForelderDataKeySpørsmål.arbeidUtlandet
                                            ].id
                                        ]
                                    }
                                    values={{ navn: barn.navn }}
                                />
                            }
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet].svar
                            }
                        />
                    )}

                    {andreForelder.arbeidsperioderUtland.map((periode, index) => (
                        <ArbeidsperiodeOppsummering
                            key={`arbeidsperiode-${index}`}
                            nummer={index + 1}
                            arbeidsperiode={periode}
                            gjelderUtlandet={true}
                            personType={PersonType.AndreForelder}
                            erDød={barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA}
                            barn={barn}
                        />
                    ))}

                    {andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            andreForelder[
                                                andreForelderDataKeySpørsmål.pensjonUtland
                                            ].id
                                        ]
                                    }
                                    values={{ navn: barn.navn }}
                                />
                            }
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar
                            }
                        />
                    )}

                    {andreForelder.pensjonsperioderUtland.map((periode, index) => (
                        <PensjonsperiodeOppsummering
                            key={`pensjonsperiode-utland-andre-forelder${index}`}
                            nummer={index + 1}
                            pensjonsperiode={periode}
                            gjelderUtlandet={true}
                            personType={PersonType.AndreForelder}
                            erDød={barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA}
                            barn={barn}
                        />
                    ))}

                    {andreForelder.utvidet[
                        andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder
                    ].svar && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder
                                        ]
                                    }
                                    values={{ navn: barn.navn }}
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
                                        andreForelderDataKeySpørsmål
                                            .søkerFlyttetFraAndreForelderDato
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
                </>
            ) : (
                <>
                    <BodyShort>
                        <SpråkTekst
                            id={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger
                                ]
                            }
                        />
                    </BodyShort>
                </>
            )}
        </FormSummary.Answers>
    );
};

export default AndreForelderOppsummering;
