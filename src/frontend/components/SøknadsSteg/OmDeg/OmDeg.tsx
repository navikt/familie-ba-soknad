import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { SøkerMåBrukePDF } from '../../Felleskomponenter/SøkerMåBrukePDF';
import { VedleggNotisTilleggsskjema } from '../../Felleskomponenter/VedleggNotis';
import { Personopplysninger } from './Personopplysninger';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from './spørsmål';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } = useOmdeg();
    const { søknad } = useApp();
    const { søker } = søknad;
    const { erEøsLand } = useEøs();
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
                {!søker.adresse && !søker.adressebeskyttelse ? (
                    <SøkerMåBrukePDF
                        advarselTekstId={'omdeg.personopplysninger.ikke-registrert.alert'}
                        utfyllendeAdvarselInfoId={'omdeg.personopplysninger.ikke-registrert.info'}
                    />
                ) : (
                    <>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.borPåRegistrertAdresse}
                            spørsmålTekstId={
                                omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse]
                            }
                            tilleggsinfoTekstId={
                                søker.adressebeskyttelse
                                    ? 'omdeg.borpådenneadressen.spm.tilleggsinfo'
                                    : ''
                            }
                        />

                        {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                            <SøkerMåBrukePDF
                                advarselTekstId={
                                    'omdeg.borpådenneadressen.kontakt-folkeregister.alert'
                                }
                                utfyllendeAdvarselInfoId={
                                    'omdeg.borpådenneadressen.ikke-endre-adresse'
                                }
                            />
                        )}
                    </>
                )}
            </KomponentGruppe>
            {skjema.felter.oppholderSegINorge.erSynlig && (
                <KomponentGruppe dynamisk>
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
                                        id={omDegSpørsmålSpråkId[OmDegSpørsmålId.søkerOppholdsland]}
                                    />
                                }
                            />
                            {erEøsLand(skjema.felter.oppholdsland.verdi) && (
                                <VedleggNotisTilleggsskjema
                                    språkTekstId={'omdeg.opphold-i-norge.eøs-info'}
                                    dynamisk
                                />
                            )}
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
        </Steg>
    );
};

export default OmDeg;
