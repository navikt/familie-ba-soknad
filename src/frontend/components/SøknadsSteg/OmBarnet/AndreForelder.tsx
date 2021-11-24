import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato } from '../../../utils/dato';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { VedleggNotisTilleggsskjema } from '../../Felleskomponenter/VedleggNotis';
import SammeSomAnnetBarnRadio from './SammeSomAnnetBarnRadio';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';

const AndreForelder: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    settSammeForelder: (radioVerdi: string) => void;
}> = ({ barn, skjema, andreBarnSomErFyltUt, settSammeForelder }) => {
    const intl = useIntl();
    const { erEøsLand } = useEøs();

    return (
        <SkjemaFieldset tittelId={'ombarnet.andre-forelder'}>
            <KomponentGruppe>
                {skjema.felter.sammeForelderSomAnnetBarn.erSynlig && (
                    <SammeSomAnnetBarnRadio
                        onChangeCallback={settSammeForelder}
                        andreBarnSomErFyltUt={andreBarnSomErFyltUt}
                        skjema={skjema}
                    />
                )}

                <KomponentGruppe>
                    <>
                        <SkjemaFeltInput
                            felt={skjema.felter.andreForelderNavn}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            labelSpråkTekstId={
                                omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderNavn]
                            }
                            disabled={skjema.felter.andreForelderNavnUkjent.verdi === ESvar.JA}
                        />
                        <SkjemaCheckbox
                            labelSpråkTekstId={
                                omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderNavnUkjent]
                            }
                            felt={skjema.felter.andreForelderNavnUkjent}
                        />
                    </>
                    {skjema.felter.andreForelderFnr.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <>
                                <SkjemaFeltInput
                                    felt={skjema.felter.andreForelderFnr}
                                    visFeilmeldinger={skjema.visFeilmeldinger}
                                    labelSpråkTekstId={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.andreForelderFnr
                                        ]
                                    }
                                    disabled={
                                        skjema.felter.andreForelderFnrUkjent.verdi === ESvar.JA
                                    }
                                />
                                <SkjemaCheckbox
                                    labelSpråkTekstId={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.andreForelderFnrUkjent
                                        ]
                                    }
                                    felt={skjema.felter.andreForelderFnrUkjent}
                                />
                            </>
                        </KomponentGruppe>
                    )}
                    {skjema.felter.andreForelderFødselsdato.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <>
                                <Datovelger
                                    felt={skjema.felter.andreForelderFødselsdato}
                                    skjema={skjema}
                                    label={
                                        <SpråkTekst
                                            id={
                                                omBarnetSpørsmålSpråkId[
                                                    OmBarnetSpørsmålsId.andreForelderFødselsdato
                                                ]
                                            }
                                        />
                                    }
                                    avgrensMaxDato={dagensDato()}
                                    disabled={
                                        skjema.felter.andreForelderFødselsdatoUkjent.verdi ===
                                        ESvar.JA
                                    }
                                />
                                <SkjemaCheckbox
                                    labelSpråkTekstId={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent
                                        ]
                                    }
                                    felt={skjema.felter.andreForelderFødselsdatoUkjent}
                                />
                            </>
                        </KomponentGruppe>
                    )}
                </KomponentGruppe>
            </KomponentGruppe>

            {skjema.felter.andreForelderArbeidUtlandet.erSynlig && (
                <KomponentGruppe dynamisk>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.andreForelderArbeidUtlandet}
                        spørsmålTekstId={
                            omBarnetSpørsmålSpråkId[barn.andreForelderArbeidUtlandet.id]
                        }
                        inkluderVetIkke={true}
                        språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                    />
                    <LandDropdown
                        felt={skjema.felter.andreForelderArbeidUtlandetHvilketLand}
                        skjema={skjema}
                        dynamisk
                        label={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        barn.andreForelderArbeidUtlandetHvilketLand.id
                                    ]
                                }
                            />
                        }
                    />
                    {erEøsLand(skjema.felter.andreForelderArbeidUtlandetHvilketLand.verdi) && (
                        <VedleggNotisTilleggsskjema
                            språkTekstId={
                                barn.andreForelderErDød.svar === ESvar.JA
                                    ? 'enkeenkemann.arbeid-utland.eøs-info'
                                    : 'ombarnet.andre-forelder.arbeid-utland.eøs-info'
                            }
                            språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                            dynamisk
                        />
                    )}
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.andreForelderPensjonUtland}
                        spørsmålTekstId={
                            omBarnetSpørsmålSpråkId[barn.andreForelderPensjonUtland.id]
                        }
                        inkluderVetIkke={true}
                        språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                    />
                    <LandDropdown
                        felt={skjema.felter.andreForelderPensjonHvilketLand}
                        skjema={skjema}
                        dynamisk
                        label={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[barn.andreForelderPensjonHvilketLand.id]
                                }
                                values={{ barn: barnetsNavnValue(barn, intl) }}
                            />
                        }
                    />
                    {erEøsLand(skjema.felter.andreForelderPensjonHvilketLand.verdi) && (
                        <VedleggNotisTilleggsskjema
                            språkTekstId={
                                barn.andreForelderErDød.svar === ESvar.JA
                                    ? 'enkeenkemann.utenlandspensjon.eøs-info'
                                    : 'ombarnet.andre-forelder.utenlandspensjon.eøs-info'
                            }
                            språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                            dynamisk
                        />
                    )}
                </KomponentGruppe>
            )}
        </SkjemaFieldset>
    );
};

export default AndreForelder;
