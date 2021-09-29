import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/person';
import { barnetsNavnValue } from '../../../utils/barn';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import SammeSomAnnetBarnRadio from './SammeSomAnnetBarnRadio';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';
import { IOmBarnetUtvidetFeltTyper } from './useOmBarnet';

const AndreForelder: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    settSammeForelder: (radioVerdi: string) => void;
}> = ({ barn, skjema, andreBarnSomErFyltUt, settSammeForelder }) => {
    const intl = useIntl();
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
                    {skjema.felter.andreForelderFnr.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <SkjemaFeltInput
                                felt={skjema.felter.andreForelderFnr}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                labelSpråkTekstId={
                                    omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFnr]
                                }
                                disabled={skjema.felter.andreForelderFnrUkjent.verdi === ESvar.JA}
                            />
                            <SkjemaCheckbox
                                labelSpråkTekstId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.andreForelderFnrUkjent
                                    ]
                                }
                                felt={skjema.felter.andreForelderFnrUkjent}
                            />
                        </KomponentGruppe>
                    )}
                    {skjema.felter.andreForelderFødselsdato.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <Datovelger
                                felt={skjema.felter.andreForelderFødselsdato}
                                skjema={skjema}
                                labelTekstId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.andreForelderFødselsdato
                                    ]
                                }
                                disabled={
                                    skjema.felter.andreForelderFødselsdatoUkjent.verdi === ESvar.JA
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
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderArbeidUtlandet]
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
                                        OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand
                                    ]
                                }
                            />
                        }
                    />
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.andreForelderPensjonUtland}
                        spørsmålTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderPensjonUtland]
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
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand
                                    ]
                                }
                            />
                        }
                    />
                </KomponentGruppe>
            )}
        </SkjemaFieldset>
    );
};

export default AndreForelder;
