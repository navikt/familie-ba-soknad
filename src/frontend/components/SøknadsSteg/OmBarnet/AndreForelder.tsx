import React from 'react';

import { FormSummary } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IArbeidsperiode, IPensjonsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import { dagensDato } from '../../../utils/dato';
import { Arbeidsperiode } from '../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { Pensjonsperiode } from '../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { SkjemaCheckboxForSanity } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckboxForSanity';
import { SkjemaFeltInputForSanity } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInputForSanity';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import AndreForelderOppsummering from '../Oppsummering/OppsummeringSteg/OmBarnet/AndreForelderOppsummering';

import SammeSomAnnetBarnRadio from './SammeSomAnnetBarnRadio';

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
    const { tekster, plainTekst } = useAppContext();

    const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
        annetBarn => annetBarn.id === skjema.felter.sammeForelderSomAnnetBarn.verdi
    );

    const {
        barnetsAndreForelder,
        navnAndreForelder,
        foedselsnummerDnummerAndreForelder,
        foedselsdatoAndreForelder,
    } = tekster().OM_BARNET;

    return (
        <SkjemaFieldset legend={plainTekst(barnetsAndreForelder)}>
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
                        <SkjemaFeltInputForSanity
                            felt={skjema.felter.andreForelderNavn}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            label={<TekstBlock block={navnAndreForelder.sporsmal} />}
                            disabled={
                                skjema.felter.andreForelderKanIkkeGiOpplysninger.verdi === ESvar.JA
                            }
                        />
                        <SkjemaCheckboxForSanity
                            felt={skjema.felter.andreForelderKanIkkeGiOpplysninger}
                            label={<TekstBlock block={navnAndreForelder.checkboxLabel} />}
                        />
                    </div>
                    {skjema.felter.andreForelderFnr.erSynlig && (
                        <div>
                            <SkjemaFeltInputForSanity
                                felt={skjema.felter.andreForelderFnr}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                label={
                                    <TekstBlock
                                        block={foedselsnummerDnummerAndreForelder.sporsmal}
                                    />
                                }
                                disabled={skjema.felter.andreForelderFnrUkjent.verdi === ESvar.JA}
                            />
                            <SkjemaCheckboxForSanity
                                felt={skjema.felter.andreForelderFnrUkjent}
                                label={
                                    <TekstBlock
                                        block={foedselsnummerDnummerAndreForelder.checkboxLabel}
                                    />
                                }
                            />
                        </div>
                    )}
                    {skjema.felter.andreForelderFødselsdato.erSynlig && (
                        <div aria-live="polite">
                            <Datovelger
                                felt={skjema.felter.andreForelderFødselsdato}
                                skjema={skjema}
                                label={<TekstBlock block={foedselsdatoAndreForelder.sporsmal} />}
                                avgrensMaxDato={dagensDato()}
                                disabled={
                                    skjema.felter.andreForelderFødselsdatoUkjent.verdi === ESvar.JA
                                }
                                strategy={'absolute'}
                            />
                            <SkjemaCheckboxForSanity
                                felt={skjema.felter.andreForelderFødselsdatoUkjent}
                                label={
                                    <TekstBlock block={foedselsdatoAndreForelder.checkboxLabel} />
                                }
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
