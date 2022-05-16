import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { andreForelderDataKeySpørsmål, IAndreForelder, IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IArbeidsperiode, IPensjonsperiode } from '../../../typer/perioder';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { dagensDato } from '../../../utils/dato';
import { PersonType } from '../../../utils/perioder';
import { Arbeidsperiode } from '../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { VedleggNotisTilleggsskjema } from '../../Felleskomponenter/VedleggNotis';
import AndreForelderOppsummering from '../Oppsummering/OppsummeringSteg/OmBarnet/AndreForelderOppsummering';
import SammeSomAnnetBarnRadio from './SammeSomAnnetBarnRadio';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';

const AndreForelder: React.FC<{
    barn: IBarnMedISøknad;
    andreForelder: IAndreForelder;
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
}> = ({
    barn,
    andreForelder,
    skjema,
    andreBarnSomErFyltUt,
    leggTilArbeidsperiode,
    fjernArbeidsperiode,
    leggTilPensjonsperiode,
    fjernPensjonsperiode,
}) => {
    const { erEøsLand } = useEøs();
    const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
        annetBarn => annetBarn.id === skjema.felter.sammeForelderSomAnnetBarn.verdi
    );
    const { toggles } = useFeatureToggles();

    return (
        <SkjemaFieldset tittelId={'ombarnet.andre-forelder'}>
            <KomponentGruppe>
                {skjema.felter.sammeForelderSomAnnetBarn.erSynlig && (
                    <SammeSomAnnetBarnRadio
                        andreBarnSomErFyltUt={andreBarnSomErFyltUt}
                        skjema={skjema}
                        barnetsNavn={barn.navn}
                    />
                )}
                {!skjema.felter.sammeForelderSomAnnetBarn.erSynlig ||
                skjema.felter.sammeForelderSomAnnetBarn.verdi ===
                    AlternativtSvarForInput.ANNEN_FORELDER ? (
                    <>
                        <KomponentGruppe>
                            <div>
                                <SkjemaFeltInput
                                    felt={skjema.felter.andreForelderNavn}
                                    visFeilmeldinger={skjema.visFeilmeldinger}
                                    labelSpråkTekstId={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.andreForelderNavn
                                        ]
                                    }
                                    disabled={
                                        skjema.felter.andreForelderNavnUkjent.verdi === ESvar.JA
                                    }
                                />
                                <SkjemaCheckbox
                                    labelSpråkTekstId={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.andreForelderNavnUkjent
                                        ]
                                    }
                                    felt={skjema.felter.andreForelderNavnUkjent}
                                />
                            </div>
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
                                                skjema.felter.andreForelderFnrUkjent.verdi ===
                                                ESvar.JA
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
                                                            OmBarnetSpørsmålsId
                                                                .andreForelderFødselsdato
                                                        ]
                                                    }
                                                />
                                            }
                                            avgrensMaxDato={dagensDato()}
                                            disabled={
                                                skjema.felter.andreForelderFødselsdatoUkjent
                                                    .verdi === ESvar.JA
                                            }
                                        />
                                        <SkjemaCheckbox
                                            labelSpråkTekstId={
                                                omBarnetSpørsmålSpråkId[
                                                    OmBarnetSpørsmålsId
                                                        .andreForelderFødselsdatoUkjent
                                                ]
                                            }
                                            felt={skjema.felter.andreForelderFødselsdatoUkjent}
                                        />
                                    </>
                                </KomponentGruppe>
                            )}
                        </KomponentGruppe>

                        {skjema.felter.andreForelderArbeidUtlandet.erSynlig && (
                            <>
                                {toggles.EØS_KOMPLETT ? (
                                    <KomponentGruppe>
                                        <Arbeidsperiode
                                            skjema={skjema}
                                            arbeiderEllerArbeidetFelt={
                                                skjema.felter.andreForelderArbeidUtlandet
                                            }
                                            leggTilArbeidsperiode={leggTilArbeidsperiode}
                                            fjernArbeidsperiode={fjernArbeidsperiode}
                                            gjelderUtlandet
                                            personType={PersonType.AndreForelder}
                                            barn={barn}
                                            erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                            registrerteArbeidsperioder={
                                                skjema.felter.andreForelderArbeidsperioderUtland
                                            }
                                        />
                                        <Pensjonsperiode
                                            skjema={skjema}
                                            mottarEllerMottattPensjonFelt={
                                                skjema.felter.andreForelderPensjonUtland
                                            }
                                            leggTilPensjonsperiode={leggTilPensjonsperiode}
                                            fjernPensjonsperiode={fjernPensjonsperiode}
                                            gjelderUtlandet={true}
                                            personType={PersonType.AndreForelder}
                                            erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                            barn={barn}
                                            registrertePensjonsperioder={
                                                skjema.felter.andreForelderPensjonsperioderUtland
                                            }
                                        />
                                    </KomponentGruppe>
                                ) : (
                                    <KomponentGruppe inline>
                                        <JaNeiSpm
                                            skjema={skjema}
                                            felt={skjema.felter.andreForelderArbeidUtlandet}
                                            spørsmålTekstId={
                                                omBarnetSpørsmålSpråkId[
                                                    andreForelder[
                                                        andreForelderDataKeySpørsmål.arbeidUtlandet
                                                    ].id
                                                ]
                                            }
                                            inkluderVetIkke={true}
                                            språkValues={{ navn: barn.navn }}
                                        />
                                        <LandDropdown
                                            felt={
                                                skjema.felter.andreForelderArbeidUtlandetHvilketLand
                                            }
                                            skjema={skjema}
                                            dynamisk
                                            ekskluderNorge
                                            label={
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
                                        />
                                        {erEøsLand(
                                            skjema.felter.andreForelderArbeidUtlandetHvilketLand
                                                .verdi
                                        ) && (
                                            <VedleggNotisTilleggsskjema
                                                språkTekstId={
                                                    barn.andreForelderErDød.svar === ESvar.JA
                                                        ? 'enkeenkemann.arbeid-utland.eøs-info'
                                                        : 'ombarnet.andre-forelder.arbeid-utland.eøs-info'
                                                }
                                                språkValues={{ navn: barn.navn }}
                                                dynamisk
                                            />
                                        )}

                                        <JaNeiSpm
                                            skjema={skjema}
                                            felt={skjema.felter.andreForelderPensjonUtland}
                                            spørsmålTekstId={
                                                omBarnetSpørsmålSpråkId[
                                                    andreForelder[
                                                        andreForelderDataKeySpørsmål.pensjonUtland
                                                    ].id
                                                ]
                                            }
                                            inkluderVetIkke={true}
                                            språkValues={{ navn: barn.navn }}
                                        />
                                        <LandDropdown
                                            felt={skjema.felter.andreForelderPensjonHvilketLand}
                                            skjema={skjema}
                                            dynamisk
                                            ekskluderNorge
                                            label={
                                                <SpråkTekst
                                                    id={
                                                        omBarnetSpørsmålSpråkId[
                                                            andreForelder[
                                                                andreForelderDataKeySpørsmål
                                                                    .pensjonHvilketLand
                                                            ].id
                                                        ]
                                                    }
                                                    values={{ barn: barn.navn }}
                                                />
                                            }
                                        />
                                        {erEøsLand(
                                            skjema.felter.andreForelderPensjonHvilketLand.verdi
                                        ) && (
                                            <VedleggNotisTilleggsskjema
                                                språkTekstId={
                                                    barn.andreForelderErDød.svar === ESvar.JA
                                                        ? 'enkeenkemann.utenlandspensjon.eøs-info'
                                                        : 'ombarnet.andre-forelder.utenlandspensjon.eøs-info'
                                                }
                                                språkValues={{ navn: barn.navn }}
                                                dynamisk
                                            />
                                        )}
                                    </KomponentGruppe>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    barnMedSammeForelder?.andreForelder && (
                        <AndreForelderOppsummering
                            barn={barn}
                            andreForelder={barnMedSammeForelder.andreForelder}
                        />
                    )
                )}
            </KomponentGruppe>
        </SkjemaFieldset>
    );
};

export default AndreForelder;
