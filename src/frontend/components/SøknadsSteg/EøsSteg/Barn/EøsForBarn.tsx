import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../../typer/barn';
import { BarnetsId } from '../../../../typer/common';
import { barnetsNavnValue, skalSkjuleAndreForelderFelt } from '../../../../utils/barn';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import SlektsforholdDropdown from '../../../Felleskomponenter/Dropdowns/SlektsforholdDropdown';
import JaNeiSpm from '../../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import { SkjemaCheckbox } from '../../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';
import EøsAndreForelderOppsummering from '../../Oppsummering/OppsummeringSteg/Eøs/EøsAndreForelderOppsummering';
import IdNummerForAndreForelder from './IdNummerForAndreForelder';
import SamletIdNummerForBarn from './SamletIdNummerForBarn';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from './spørsmål';
import { useEøsForBarn } from './useEøsForBarn';

const EøsForBarn: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilAndreUtbetalingsperiode,
        fjernAndreUtbetalingsperiode,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        settIdNummerFelterForBarn,
        settIdNummerFelterForAndreForelder,
    } = useEøsForBarn(barnetsId);
    const intl = useIntl();
    const { søknad } = useApp();

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad =>
            barnISøknad.barnErFyltUt && barnISøknad.id !== barn.id && !!barnISøknad.andreForelder
    );

    const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
        annetBarn => annetBarn.id === barn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar
    );

    return (
        <Steg
            tittel={
                <SpråkTekst
                    id={'eøs-om-barn.sidetittel'}
                    values={{ barn: barnetsNavnValue(barn, intl) }}
                />
            }
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <SamletIdNummerForBarn
                barn={barn}
                settIdNummerFelter={settIdNummerFelterForBarn}
                skjema={skjema}
            />
            <KomponentGruppe>
                <SlektsforholdDropdown
                    felt={skjema.felter.søkersSlektsforhold}
                    skjema={skjema}
                    placeholder={intl.formatMessage({ id: 'felles.velgslektsforhold.spm' })}
                    label={
                        <SpråkTekst
                            id={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.søkersSlektsforhold]}
                            values={{ barn: barnetsNavnValue(barn, intl) }}
                        />
                    }
                    gjelderSøker={true}
                />
                {skjema.felter.søkersSlektsforholdSpesifisering.erSynlig && (
                    <SkjemaFeltInput
                        felt={skjema.felter.søkersSlektsforholdSpesifisering}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            eøsBarnSpørsmålSpråkId[
                                EøsBarnSpørsmålId.søkersSlektsforholdSpesifisering
                            ]
                        }
                        språkValues={{
                            barn: barnetsNavnValue(barn, intl),
                        }}
                    />
                )}

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.borMedAndreForelder}
                    spørsmålTekstId={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.borMedAndreForelder]}
                    språkValues={{ barn: barnetsNavnValue(barn, intl) }}
                />
                {skjema.felter.borMedAndreForelder.verdi === ESvar.NEI && (
                    <SkjemaFieldset
                        tittelId={'eøs-om-barn.annenomsorgsperson.gjenlevende'}
                        språkValues={{ barn: barnetsNavnValue(barn, intl) }}
                    >
                        {skjema.felter.omsorgspersonNavn.erSynlig && (
                            <SkjemaFeltInput
                                felt={skjema.felter.omsorgspersonNavn}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                labelSpråkTekstId={
                                    eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonNavn]
                                }
                            />
                        )}
                        {skjema.felter.omsorgspersonSlektsforhold.erSynlig && (
                            <SlektsforholdDropdown
                                felt={skjema.felter.omsorgspersonSlektsforhold}
                                skjema={skjema}
                                placeholder={intl.formatMessage({
                                    id: 'felles.velgslektsforhold.spm',
                                })}
                                label={
                                    <SpråkTekst
                                        id={
                                            eøsBarnSpørsmålSpråkId[
                                                EøsBarnSpørsmålId.omsorgspersonSlektsforhold
                                            ]
                                        }
                                        values={{ barn: barnetsNavnValue(barn, intl) }}
                                    />
                                }
                                gjelderSøker={false}
                            />
                        )}
                        {skjema.felter.omsorgpersonSlektsforholdSpesifisering.erSynlig && (
                            <SkjemaFeltInput
                                felt={skjema.felter.omsorgpersonSlektsforholdSpesifisering}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                labelSpråkTekstId={
                                    eøsBarnSpørsmålSpråkId[
                                        EøsBarnSpørsmålId.omsorgspersonSlektsforholdSpesifisering
                                    ]
                                }
                                språkValues={{
                                    barn: barnetsNavnValue(barn, intl),
                                }}
                            />
                        )}
                        {skjema.felter.omsorgspersonIdNummer.erSynlig && (
                            <>
                                <SkjemaFeltInput
                                    felt={skjema.felter.omsorgspersonIdNummer}
                                    visFeilmeldinger={skjema.visFeilmeldinger}
                                    labelSpråkTekstId={
                                        eøsBarnSpørsmålSpråkId[
                                            EøsBarnSpørsmålId.omsorgspersonIdNummer
                                        ]
                                    }
                                    disabled={
                                        skjema.felter.omsorgspersonIdNummerVetIkke.verdi ===
                                        ESvar.JA
                                    }
                                />

                                <SkjemaCheckbox
                                    felt={skjema.felter.omsorgspersonIdNummerVetIkke}
                                    labelSpråkTekstId={
                                        eøsBarnSpørsmålSpråkId[
                                            EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke
                                        ]
                                    }
                                />
                            </>
                        )}
                        {skjema.felter.omsorgspersonAdresse.erSynlig && (
                            <SkjemaFeltInput
                                felt={skjema.felter.omsorgspersonAdresse}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                labelSpråkTekstId={
                                    eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonAdresse]
                                }
                            />
                        )}
                    </SkjemaFieldset>
                )}
                {skjema.felter.barnetsAdresse.erSynlig && (
                    <>
                        <SkjemaFeltInput
                            felt={skjema.felter.barnetsAdresse}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            description={<SpråkTekst id={'felles.hjelpetekst.fulladresse'} />}
                            labelSpråkTekstId={
                                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.barnetsAdresse]
                            }
                            språkValues={{ barn: barnetsNavnValue(barn, intl) }}
                            disabled={skjema.felter.barnetsAdresseVetIkke.verdi === ESvar.JA}
                        />

                        <SkjemaCheckbox
                            felt={skjema.felter.barnetsAdresseVetIkke}
                            labelSpråkTekstId={
                                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.barnetsAdresseVetIkke]
                            }
                        />
                    </>
                )}
            </KomponentGruppe>
            {!skalSkjuleAndreForelderFelt(barn) && (
                <SkjemaFieldset tittelId={'ombarnet.andre-forelder'}>
                    {!barnMedSammeForelder ? (
                        <KomponentGruppe>
                            <IdNummerForAndreForelder
                                skjema={skjema}
                                settIdNummerFelter={settIdNummerFelterForAndreForelder}
                                barn={barn}
                            />
                            <Arbeidsperiode
                                skjema={skjema}
                                leggTilArbeidsperiode={leggTilArbeidsperiode}
                                fjernArbeidsperiode={fjernArbeidsperiode}
                                arbeiderEllerArbeidetFelt={skjema.felter.andreForelderArbeidNorge}
                                registrerteArbeidsperioder={
                                    skjema.felter.andreForelderArbeidsperioderNorge
                                }
                                andreForelderData={{
                                    erDød: barn.andreForelderErDød.svar === ESvar.JA,
                                    barn: barn,
                                }}
                            />
                            <Pensjonsperiode
                                skjema={skjema}
                                mottarEllerMottattPensjonFelt={
                                    skjema.felter.andreForelderPensjonNorge
                                }
                                leggTilPensjonsperiode={leggTilPensjonsperiode}
                                fjernPensjonsperiode={fjernPensjonsperiode}
                                andreForelderData={{
                                    erDød: barn.andreForelderErDød.svar === ESvar.JA,
                                    barn: barn,
                                }}
                                registrertePensjonsperioder={
                                    skjema.felter.andreForelderPensjonsperioderNorge
                                }
                            />
                            <Utbetalingsperiode
                                skjema={skjema}
                                mottarEllerMottattUtbetalingFelt={
                                    skjema.felter.andreForelderAndreUtbetalinger
                                }
                                leggTilUtbetalingsperiode={leggTilAndreUtbetalingsperiode}
                                fjernUtbetalingsperiode={fjernAndreUtbetalingsperiode}
                                andreForelderData={{
                                    erDød: barn.andreForelderErDød.svar === ESvar.JA,
                                    barn: barn,
                                }}
                                registrerteUtbetalingsperioder={
                                    skjema.felter.andreForelderAndreUtbetalingsperioder
                                }
                            />
                        </KomponentGruppe>
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
