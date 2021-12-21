import React from 'react';

import { useIntl } from 'react-intl';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import { AlternativtSvarForInput } from '../../../typer/common';
import { andreForelderDataKeySpørsmål, IPensjonsperiode } from '../../../typer/person';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { IAndreForelder, IBarnMedISøknad } from '../../../typer/søknad';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato } from '../../../utils/dato';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import { PensjonModal } from '../../Felleskomponenter/PensjonModal/PensjonModal';
import { PensjonOppsummering } from '../../Felleskomponenter/PensjonModal/PensjonOppsummering';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
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
    leggTilPensjonsperiodeAndreForelder: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiodeAndreForelder: (periode: IPensjonsperiode) => void;
    pensjonsperioderAndreForelder: IPensjonsperiode[];
}> = ({
    barn,
    andreForelder,
    skjema,
    andreBarnSomErFyltUt,
    leggTilPensjonsperiodeAndreForelder,
    fjernPensjonsperiodeAndreForelder,
    pensjonsperioderAndreForelder,
}) => {
    const { erEøsLand } = useEøs();
    const intl = useIntl();
    const barnetsNavn = barnetsNavnValue(barn, intl);
    const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
        annetBarn => annetBarn.id === skjema.felter.sammeForelderSomAnnetBarn.verdi
    );
    const {
        erÅpen: erÅpenAndreForelderPensjonsmodal,
        toggleModal: toggleAndreForelderPensjonsmodal,
    } = useModal();

    return (
        <SkjemaFieldset tittelId={'ombarnet.andre-forelder'}>
            <KomponentGruppe>
                {skjema.felter.sammeForelderSomAnnetBarn.erSynlig && (
                    <SammeSomAnnetBarnRadio
                        andreBarnSomErFyltUt={andreBarnSomErFyltUt}
                        skjema={skjema}
                        barnetsNavn={barnetsNavn}
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
                            <KomponentGruppe dynamisk>
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
                                    språkValues={{ navn: barnetsNavn }}
                                />
                                <LandDropdown
                                    felt={skjema.felter.andreForelderArbeidUtlandetHvilketLand}
                                    skjema={skjema}
                                    dynamisk
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
                                    skjema.felter.andreForelderArbeidUtlandetHvilketLand.verdi
                                ) && (
                                    <VedleggNotisTilleggsskjema
                                        språkTekstId={
                                            barn.andreForelderErDød.svar === ESvar.JA
                                                ? 'enkeenkemann.arbeid-utland.eøs-info'
                                                : 'ombarnet.andre-forelder.arbeid-utland.eøs-info'
                                        }
                                        språkValues={{ navn: barnetsNavn }}
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
                                    språkValues={{ navn: barnetsNavn }}
                                />
                                {process.env.NODE_ENV === 'development' &&
                                    skjema.felter.andreForelderPensjonUtland.verdi === ESvar.JA && (
                                        <>
                                            {pensjonsperioderAndreForelder.map((periode, index) => (
                                                <PensjonOppsummering
                                                    periode={periode}
                                                    nummer={index + 1}
                                                    fjernPeriodeCallback={
                                                        fjernPensjonsperiodeAndreForelder
                                                    }
                                                    visFjernKnapp={true}
                                                    barn={barn}
                                                />
                                            ))}
                                            {pensjonsperioderAndreForelder.length > 0 && (
                                                <Element>
                                                    <SpråkTekst
                                                        id={'ombarnet.flerepensjonsperioder.spm'}
                                                        values={{
                                                            barn: barnetsNavnValue(barn, intl),
                                                        }}
                                                    />
                                                </Element>
                                            )}
                                            <LeggTilKnapp
                                                onClick={() => toggleAndreForelderPensjonsmodal()}
                                                språkTekst={
                                                    'felles.modal.leggtilpensjonutland.tittel'
                                                }
                                            />
                                        </>
                                    )}
                                <LandDropdown
                                    felt={skjema.felter.andreForelderPensjonHvilketLand}
                                    skjema={skjema}
                                    dynamisk
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
                                            values={{ barn: barnetsNavn }}
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
                                        språkValues={{ navn: barnetsNavn }}
                                        dynamisk
                                    />
                                )}
                            </KomponentGruppe>
                        )}
                        <PensjonModal
                            onLeggTilPensjonsPeriode={leggTilPensjonsperiodeAndreForelder}
                            erÅpen={erÅpenAndreForelderPensjonsmodal}
                            toggleModal={toggleAndreForelderPensjonsmodal}
                            barn={barn}
                        />
                    </>
                ) : (
                    barnMedSammeForelder?.andreForelder && (
                        <AndreForelderOppsummering
                            barnetsNavn={barnetsNavn}
                            andreForelder={barnMedSammeForelder.andreForelder}
                        />
                    )
                )}
            </KomponentGruppe>
        </SkjemaFieldset>
    );
};

export default AndreForelder;
