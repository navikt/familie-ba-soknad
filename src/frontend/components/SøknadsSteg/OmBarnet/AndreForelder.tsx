import React from 'react';

import { FormSummary } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IArbeidsperiode, IPensjonsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import { dagensDato } from '../../../utils/dato';
import { Arbeidsperiode } from '../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { Pensjonsperiode } from '../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import AndreForelderOppsummering from '../Oppsummering/OppsummeringSteg/OmBarnet/AndreForelderOppsummering';

import SammeSomAnnetBarnRadio from './SammeSomAnnetBarnRadio';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';

const AndreForelder: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetFeltTyper, string>;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
}> = ({
    barn,
    skjema,
    andreBarnSomErFyltUt,
    leggTilArbeidsperiode,
    fjernArbeidsperiode,
    leggTilPensjonsperiode,
    fjernPensjonsperiode,
}) => {
    const { tekster, plainTekst } = useApp();

    const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
        annetBarn => annetBarn.id === skjema.felter.sammeForelderSomAnnetBarn.verdi
    );

    const { barnetsAndreForelder } = tekster().OM_BARNET;

    return (
        <SkjemaFieldset legendSpråkId={'ombarnet.andre-forelder'}>
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
                    <div>
                        <SkjemaFeltInput
                            felt={skjema.felter.andreForelderNavn}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            labelSpråkTekstId={
                                omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderNavn]
                            }
                            disabled={
                                skjema.felter.andreForelderKanIkkeGiOpplysninger.verdi === ESvar.JA
                            }
                        />
                        <SkjemaCheckbox
                            labelSpråkTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger
                                ]
                            }
                            felt={skjema.felter.andreForelderKanIkkeGiOpplysninger}
                        />
                    </div>
                    {skjema.felter.andreForelderFnr.erSynlig && (
                        <div>
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
                        </div>
                    )}
                    {skjema.felter.andreForelderFødselsdato.erSynlig && (
                        <div>
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
                                    skjema.felter.andreForelderFødselsdatoUkjent.verdi === ESvar.JA
                                }
                                strategy={'absolute'}
                            />
                            <SkjemaCheckbox
                                labelSpråkTekstId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent
                                    ]
                                }
                                felt={skjema.felter.andreForelderFødselsdatoUkjent}
                            />
                        </div>
                    )}
                    {skjema.felter.andreForelderArbeidUtlandet.erSynlig && (
                        <>
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
                        </>
                    )}
                </>
            ) : (
                barnMedSammeForelder?.andreForelder && (
                    <FormSummary>
                        <FormSummary.Header>{plainTekst(barnetsAndreForelder)}</FormSummary.Header>
                        <AndreForelderOppsummering
                            barn={barn}
                            andreForelder={barnMedSammeForelder.andreForelder}
                        />
                    </FormSummary>
                )
            )}
        </SkjemaFieldset>
    );
};

export default AndreForelder;
