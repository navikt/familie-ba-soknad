import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/person';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import SammeSomAnnetBarnRadio from './SammeSomAnnetBarnRadio';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';
import { IOmBarnetUtvidetFeltTyper } from './useOmBarnet';
import VetIkkeCheckbox from './VetIkkeCheckbox';

const AndreForelder: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    settSammeForelder: (radioVerdi: string) => void;
}> = ({ barn, skjema, andreBarnSomErFyltUt, settSammeForelder }) => {
    return (
        <SkjemaFieldset tittelId={'ombarnet.andre-forelder'} språkValues={{ navn: barn.navn }}>
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
                    <VetIkkeCheckbox
                        labelSpråkId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderNavnUkjent]
                        }
                        checkboxUkjentFelt={skjema.felter.andreForelderNavnUkjent}
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
                            <VetIkkeCheckbox
                                labelSpråkId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.andreForelderFnrUkjent
                                    ]
                                }
                                checkboxUkjentFelt={skjema.felter.andreForelderFnrUkjent}
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
                            <VetIkkeCheckbox
                                labelSpråkId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent
                                    ]
                                }
                                checkboxUkjentFelt={skjema.felter.andreForelderFødselsdatoUkjent}
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
                        språkValues={{ navn: barn.navn }}
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
                        språkValues={{ navn: barn.navn }}
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
