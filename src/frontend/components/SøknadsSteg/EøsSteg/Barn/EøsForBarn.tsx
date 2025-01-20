import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../../typer/barn';
import { BarnetsId } from '../../../../typer/common';
import { PersonType } from '../../../../typer/personType';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { skalSkjuleAndreForelderFelt } from '../../../../utils/barn';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import { Barnetrygdperiode } from '../../../Felleskomponenter/Barnetrygdperiode/Barnetrygdperiode';
import { LandDropdown } from '../../../Felleskomponenter/Dropdowns/LandDropdown';
import SlektsforholdDropdown from '../../../Felleskomponenter/Dropdowns/SlektsforholdDropdown';
import JaNeiSpmForSanity from '../../../Felleskomponenter/JaNeiSpm/JaNeiSpmForSanity';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import TekstBlock from '../../../Felleskomponenter/Sanity/TekstBlock';
import { SkjemaCheckboxForSanity } from '../../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckboxForSanity';
import { SkjemaFeltInputForSanity } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInputForSanity';
import SkjemaFieldset from '../../../Felleskomponenter/SkjemaFieldset';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';
import EøsAndreForelderOppsummering from '../../Oppsummering/OppsummeringSteg/Eøs/EøsAndreForelderOppsummering';

import IdNummerForAndreForelder from './IdNummerForAndreForelder';
import Omsorgsperson from './Omsorgsperson';
import SamletIdNummerForBarn from './SamletIdNummerForBarn';
import { useEøsForBarn } from './useEøsForBarn';

const EøsForBarn: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
        leggTilPensjonsperiodeNorgeAndreForelder,
        fjernPensjonsperiodeNorgeAndreForelder,
        leggTilAndreUtbetalingsperiodeAndreForelder,
        fjernAndreUtbetalingsperiodeAndreForelder,
        leggTilArbeidsperiodeNorgeAndreForelder,
        fjernArbeidsperiodeNorgeAndreForelder,
        leggTilBarnetrygdsperiodeAndreForelder,
        fjernBarnetrygdsperiodeAndreForelder,
        settIdNummerFelterForBarn,
        settIdNummerFelterForAndreForelder,
        leggTilArbeidsperiodeUtlandOmsorgsperson,
        fjernArbeidsperiodeUtlandOmsorgsperson,
        leggTilArbeidsperiodeNorgeOmsorgsperson,
        fjernArbeidsperiodeNorgeOmsorgsperson,
        leggTilPensjonsperiodeUtlandOmsorgsperson,
        fjernPensjonsperiodeUtlandOmsorgsperson,
        leggTilPensjonsperiodeNorgeOmsorgsperson,
        fjernPensjonsperiodeNorgeOmsorgsperson,
        leggTilAndreUtbetalingsperiodeOmsorgsperson,
        fjernAndreUtbetalingsperiodeOmsorgsperson,
        leggTilBarnetrygdsperiodeOmsorgsperson,
        fjernBarnetrygdsperiodeOmsorgsperson,
    } = useEøsForBarn(barnetsId);
    const { søknad, tekster, plainTekst } = useApp();

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad =>
            barnISøknad.barnErFyltUt && barnISøknad.id !== barn.id && !!barnISøknad.andreForelder
    );

    const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
        annetBarn => annetBarn.id === barn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar
    );

    const stegTekster = tekster()[ESanitySteg.EØS_FOR_BARN];
    const {
        eoesForBarnTittel,
        eosForBarnGuide,
        valgalternativSlektsforholdPlaceholder,
        slektsforhold,
        hvilkenRelasjon,
        borMedAndreForelder,
        borMedOmsorgsperson,
        hvorBorBarnet,
        subtittelAndreForelder,
        hvorBorAndreForelder,
        paagaaendeSoeknadYtelseAndreForelder,
        hvilketLandSoektYtelseAndreForelder,
    } = stegTekster;

    return (
        <Steg
            tittel={
                <TekstBlock block={eoesForBarnTittel} flettefelter={{ barnetsNavn: barn.navn }} />
            }
            guide={eosForBarnGuide}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <div>
                <SamletIdNummerForBarn
                    barn={barn}
                    settIdNummerFelter={settIdNummerFelterForBarn}
                    skjema={skjema}
                />
            </div>
            {skjema.felter.søkersSlektsforhold.erSynlig && (
                <>
                    <SlektsforholdDropdown
                        felt={skjema.felter.søkersSlektsforhold}
                        skjema={skjema}
                        placeholder={plainTekst(valgalternativSlektsforholdPlaceholder)}
                        label={
                            <TekstBlock
                                block={slektsforhold.sporsmal}
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                        }
                        gjelderSøker={true}
                    />
                    {skjema.felter.søkersSlektsforholdSpesifisering.erSynlig && (
                        <SkjemaFeltInputForSanity
                            felt={skjema.felter.søkersSlektsforholdSpesifisering}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            label={
                                <TekstBlock
                                    block={hvilkenRelasjon.sporsmal}
                                    flettefelter={{ barnetsNavn: barn.navn }}
                                />
                            }
                        />
                    )}
                </>
            )}
            {(skjema.felter.borMedAndreForelder.erSynlig ||
                skjema.felter.borMedOmsorgsperson.erSynlig) && (
                <>
                    <JaNeiSpmForSanity
                        skjema={skjema}
                        felt={skjema.felter.borMedAndreForelder}
                        spørsmålDokument={borMedAndreForelder}
                        flettefelter={{ barnetsNavn: barn.navn }}
                    />
                    <JaNeiSpmForSanity
                        skjema={skjema}
                        felt={skjema.felter.borMedOmsorgsperson}
                        spørsmålDokument={borMedOmsorgsperson}
                        flettefelter={{ barnetsNavn: barn.navn }}
                    />
                </>
            )}
            {skjema.felter.borMedOmsorgsperson.verdi === ESvar.JA && (
                <Omsorgsperson
                    skjema={skjema}
                    barn={barn}
                    periodeFunksjoner={{
                        leggTilArbeidsperiodeUtlandOmsorgsperson,
                        fjernArbeidsperiodeUtlandOmsorgsperson,
                        leggTilArbeidsperiodeNorgeOmsorgsperson,
                        fjernArbeidsperiodeNorgeOmsorgsperson,
                        leggTilPensjonsperiodeUtlandOmsorgsperson,
                        fjernPensjonsperiodeUtlandOmsorgsperson,
                        leggTilPensjonsperiodeNorgeOmsorgsperson,
                        fjernPensjonsperiodeNorgeOmsorgsperson,
                        leggTilAndreUtbetalingsperiodeOmsorgsperson,
                        fjernAndreUtbetalingsperiodeOmsorgsperson,
                        leggTilBarnetrygdsperiodeOmsorgsperson,
                        fjernBarnetrygdsperiodeOmsorgsperson,
                    }}
                />
            )}
            {skjema.felter.barnetsAdresse.erSynlig && (
                <div>
                    <SkjemaFeltInputForSanity
                        felt={skjema.felter.barnetsAdresse}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        description={plainTekst(hvorBorBarnet.beskrivelse)}
                        label={
                            <TekstBlock
                                block={hvorBorBarnet.sporsmal}
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                        }
                        disabled={skjema.felter.barnetsAdresseVetIkke.verdi === ESvar.JA}
                    />
                    <SkjemaCheckboxForSanity
                        felt={skjema.felter.barnetsAdresseVetIkke}
                        label={plainTekst(hvorBorBarnet.checkboxLabel)}
                    />
                </div>
            )}
            {!skalSkjuleAndreForelderFelt(barn) && (
                <SkjemaFieldset
                    legendSpråkId={'ombarnet.andre-forelder'}
                    legend={plainTekst(subtittelAndreForelder, { barnetsNavn: barn.navn })}
                >
                    {!barnMedSammeForelder ? (
                        <>
                            <IdNummerForAndreForelder
                                skjema={skjema}
                                settIdNummerFelter={settIdNummerFelterForAndreForelder}
                                barn={barn}
                            />
                            {skjema.felter.andreForelderAdresse.erSynlig && (
                                <div>
                                    <SkjemaFeltInputForSanity
                                        felt={skjema.felter.andreForelderAdresse}
                                        visFeilmeldinger={skjema.visFeilmeldinger}
                                        label={
                                            <TekstBlock
                                                block={hvorBorAndreForelder.sporsmal}
                                                flettefelter={{ barnetsNavn: barn.navn }}
                                            />
                                        }
                                        description={plainTekst(hvorBorAndreForelder.beskrivelse)}
                                        disabled={
                                            skjema.felter.andreForelderAdresseVetIkke.verdi ===
                                            ESvar.JA
                                        }
                                    />
                                    <SkjemaCheckboxForSanity
                                        felt={skjema.felter.andreForelderAdresseVetIkke}
                                        label={plainTekst(hvorBorAndreForelder.checkboxLabel)}
                                    />
                                </div>
                            )}
                            <Arbeidsperiode
                                skjema={skjema}
                                leggTilArbeidsperiode={leggTilArbeidsperiodeNorgeAndreForelder}
                                fjernArbeidsperiode={fjernArbeidsperiodeNorgeAndreForelder}
                                arbeiderEllerArbeidetFelt={skjema.felter.andreForelderArbeidNorge}
                                registrerteArbeidsperioder={
                                    skjema.felter.andreForelderArbeidsperioderNorge
                                }
                                personType={PersonType.AndreForelder}
                                erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                barn={barn}
                            />
                            <Pensjonsperiode
                                skjema={skjema}
                                mottarEllerMottattPensjonFelt={
                                    skjema.felter.andreForelderPensjonNorge
                                }
                                leggTilPensjonsperiode={leggTilPensjonsperiodeNorgeAndreForelder}
                                fjernPensjonsperiode={fjernPensjonsperiodeNorgeAndreForelder}
                                personType={PersonType.AndreForelder}
                                erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                barn={barn}
                                gjelderUtlandet={false}
                                registrertePensjonsperioder={
                                    skjema.felter.andreForelderPensjonsperioderNorge
                                }
                            />
                            <Utbetalingsperiode
                                skjema={skjema}
                                tilhørendeJaNeiSpmFelt={
                                    skjema.felter.andreForelderAndreUtbetalinger
                                }
                                leggTilUtbetalingsperiode={
                                    leggTilAndreUtbetalingsperiodeAndreForelder
                                }
                                fjernUtbetalingsperiode={fjernAndreUtbetalingsperiodeAndreForelder}
                                personType={PersonType.AndreForelder}
                                erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                barn={barn}
                                registrerteUtbetalingsperioder={
                                    skjema.felter.andreForelderAndreUtbetalingsperioder
                                }
                            />
                            <JaNeiSpmForSanity
                                skjema={skjema}
                                felt={skjema.felter.andreForelderPågåendeSøknadFraAnnetEøsLand}
                                spørsmålDokument={paagaaendeSoeknadYtelseAndreForelder}
                                inkluderVetIkke
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                            {skjema.felter.andreForelderPågåendeSøknadHvilketLand.erSynlig && (
                                <LandDropdown
                                    felt={skjema.felter.andreForelderPågåendeSøknadHvilketLand}
                                    skjema={skjema}
                                    kunEøs={true}
                                    ekskluderNorge
                                    label={
                                        <TekstBlock
                                            block={hvilketLandSoektYtelseAndreForelder.sporsmal}
                                            flettefelter={{ barnetsNavn: barn.navn }}
                                        />
                                    }
                                />
                            )}
                            <Barnetrygdperiode
                                skjema={skjema}
                                tilhørendeJaNeiSpmFelt={skjema.felter.andreForelderBarnetrygdFraEøs}
                                registrerteEøsBarnetrygdsperioder={
                                    skjema.felter.andreForelderEøsBarnetrygdsperioder
                                }
                                leggTilBarnetrygdsperiode={leggTilBarnetrygdsperiodeAndreForelder}
                                fjernBarnetrygdsperiode={fjernBarnetrygdsperiodeAndreForelder}
                                barn={barn}
                                personType={PersonType.AndreForelder}
                                erDød={barn.andreForelderErDød.svar === ESvar.JA}
                            />
                        </>
                    ) : (
                        barnMedSammeForelder?.andreForelder && (
                            <EøsAndreForelderOppsummering
                                barn={barn}
                                andreForelder={barnMedSammeForelder.andreForelder}
                                skjema={skjema}
                                settIdNummerFelter={settIdNummerFelterForAndreForelder}
                            />
                        )
                    )}
                </SkjemaFieldset>
            )}
        </Steg>
    );
};

export default EøsForBarn;
