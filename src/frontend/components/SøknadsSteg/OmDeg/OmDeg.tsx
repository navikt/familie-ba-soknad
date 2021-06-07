import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { SøkerMåBrukePDF } from '../../Felleskomponenter/SøkerMåBrukePDF';
import { Personopplysninger } from './Personopplysninger';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from './spørsmål';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } = useOmdeg();
    const { søknad } = useApp();
    const { søker } = søknad;
    return (
        <Steg
            tittel={<SpråkTekst id={'omdeg.sidetittel'} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <KomponentGruppe>
                <Personopplysninger />
            </KomponentGruppe>

            <KomponentGruppe>
                {søker.adresse && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.borPåRegistrertAdresse}
                        spørsmålTekstId={
                            omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse]
                        }
                        tilleggsinfoTekstId={'omdeg.borpådenneadressen.spm.tilleggsinfo'}
                    />
                )}

                {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                    <SøkerMåBrukePDF
                        advarselTekstId={'omdeg.borpådenneadressen.kontakt-folkeregister.alert'}
                        utfyllendeAdvarselInfoId={'omdeg.borpådenneadressen.ikke-endre-adresse'}
                    />
                )}
                {!søker.adresse && (
                    <SøkerMåBrukePDF
                        advarselTekstId={
                            søker.adressebeskyttelse
                                ? 'omdeg.personopplysninger.adressesperre.alert'
                                : 'omdeg.personopplysninger.ikke-registrert.alert'
                        }
                    />
                )}
            </KomponentGruppe>

            {skjema.felter.telefonnummer.erSynlig && (
                <KomponentGruppe dynamisk>
                    <span id={skjema.felter.telefonnummer.id}>
                        <SkjemaFeltInput
                            felt={skjema.felter.telefonnummer}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            labelSpråkTekstId={omDegSpørsmålSpråkId.telefonnummer}
                            bredde="M"
                            type="tel"
                            maxLength={20}
                        />
                    </span>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.oppholderSegINorge}
                        spørsmålTekstId={omDegSpørsmålSpråkId[OmDegSpørsmålId.oppholderSegINorge]}
                    />

                    {skjema.felter.oppholdsland.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <LandDropdown
                                felt={skjema.felter.oppholdsland}
                                skjema={skjema}
                                label={
                                    <SpråkTekst
                                        id={omDegSpørsmålSpråkId[OmDegSpørsmålId.oppholdsland]}
                                    />
                                }
                            />
                            <Datovelger
                                avgrensDatoFremITid={true}
                                felt={skjema.felter.oppholdslandDato}
                                skjema={skjema}
                                labelTekstId={
                                    omDegSpørsmålSpråkId[OmDegSpørsmålId.oppholdslandDato]
                                }
                            />
                        </KomponentGruppe>
                    )}
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.værtINorgeITolvMåneder}
                        spørsmålTekstId={
                            omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder]
                        }
                    />
                    <Datovelger
                        avgrensDatoFremITid={true}
                        felt={skjema.felter.komTilNorgeDato}
                        skjema={skjema}
                        labelTekstId={omDegSpørsmålSpråkId[OmDegSpørsmålId.komTilNorgeDato]}
                        dynamisk
                    />

                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                        spørsmålTekstId={
                            omDegSpørsmålSpråkId[OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]
                        }
                    />
                    {skjema.felter.planleggerÅBoINorgeTolvMnd.verdi === ESvar.NEI && (
                        <AlertStripe type={'advarsel'} dynamisk>
                            <SpråkTekst id={'omdeg.planlagt-opphold-sammenhengende.alert'} />
                        </AlertStripe>
                    )}
                </KomponentGruppe>
            )}

            {skjema.felter.erAsylsøker.erSynlig && (
                <KomponentGruppe dynamisk>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.erAsylsøker}
                        spørsmålTekstId={omDegSpørsmålSpråkId[OmDegSpørsmålId.erAsylsøker]}
                    />
                    {skjema.felter.erAsylsøker.verdi === ESvar.JA && (
                        <AlertStripe type={'info'} dynamisk>
                            <SpråkTekst id={'omdeg.asylsøker.alert'} />
                        </AlertStripe>
                    )}
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.jobberPåBåt}
                        spørsmålTekstId={omDegSpørsmålSpråkId[OmDegSpørsmålId.jobberPåBåt]}
                    />

                    <LandDropdown
                        felt={skjema.felter.arbeidsland}
                        skjema={skjema}
                        label={
                            <SpråkTekst id={omDegSpørsmålSpråkId[OmDegSpørsmålId.arbeidsland]} />
                        }
                        dynamisk
                    />

                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.mottarUtenlandspensjon}
                        spørsmålTekstId={
                            omDegSpørsmålSpråkId[OmDegSpørsmålId.mottarUtenlandspensjon]
                        }
                    />
                    <LandDropdown
                        felt={skjema.felter.pensjonsland}
                        skjema={skjema}
                        label={
                            <SpråkTekst id={omDegSpørsmålSpråkId[OmDegSpørsmålId.pensjonsland]} />
                        }
                        dynamisk
                    />
                </KomponentGruppe>
            )}
        </Steg>
    );
};

export default OmDeg;
