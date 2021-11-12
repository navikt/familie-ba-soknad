import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { SøkerMåBrukePDF } from '../../Felleskomponenter/SøkerMåBrukePDF';
import {
    fraDatoFeilmeldingSpråkIdsSøker,
    fraDatoLabelSpråkIdsSøker,
    landFeilmeldingSpråkIdsSøker,
    landLabelSpråkIdsSøker,
    tilDatoFeilmeldingSpråkIdsSøker,
    tilDatoLabelSpråkIdsSøker,
    tilDatoUkjentLabelSpråkIdSøker,
    årsakFeilmeldingSpråkIdSøker,
    årsakSpråkIdsSøker,
} from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { UtenlandsoppholdModal } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsoppholdModal';
import { Personopplysninger } from './Personopplysninger';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from './spørsmål';
import { useOmdeg } from './useOmdeg';
import { UtenlandsperiodeSøkerOppsummering } from './UtenlandsperiodeSøkerOppsummering';

const OmDeg: React.FC = () => {
    const { søknad } = useApp();
    const { søker } = søknad;
    const { erÅpen, toggleModal } = useModal();

    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
    } = useOmdeg();

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
            {skjema.felter.værtINorgeITolvMåneder.erSynlig && (
                <KomponentGruppe dynamisk>
                    <>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.værtINorgeITolvMåneder}
                            spørsmålTekstId={
                                omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder]
                            }
                        />
                        {skjema.felter.værtINorgeITolvMåneder.verdi === ESvar.NEI && (
                            <>
                                <LeggTilKnapp
                                    språkTekst="eøs.leggtilendaflereutenlandsopphold.knapp"
                                    onClick={toggleModal}
                                />
                                {utenlandsperioder.map((periode, index) => (
                                    <UtenlandsperiodeSøkerOppsummering
                                        key={index}
                                        periode={periode}
                                        nummer={index + 1}
                                        fjernPeriodeCallback={fjernUtenlandsperiode}
                                    />
                                ))}
                            </>
                        )}
                    </>
                    {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                                spørsmålTekstId={
                                    omDegSpørsmålSpråkId[OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]
                                }
                            />
                            {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig &&
                                skjema.felter.planleggerÅBoINorgeTolvMnd.verdi === ESvar.NEI && (
                                    <AlertStripe type={'advarsel'} dynamisk>
                                        <SpråkTekst
                                            id={'omdeg.planlagt-opphold-sammenhengende.alert'}
                                        />
                                    </AlertStripe>
                                )}
                        </KomponentGruppe>
                    )}
                </KomponentGruppe>
            )}
            <UtenlandsoppholdModal
                erÅpen={erÅpen}
                toggleModal={toggleModal}
                årsakLabelSpråkId={'modal.beskriveopphold.spm'}
                årsakFeilmeldingSpråkId={årsakFeilmeldingSpråkIdSøker}
                årsakSpråkIds={årsakSpråkIdsSøker}
                landLabelSpråkIds={landLabelSpråkIdsSøker}
                landFeilmeldingSpråkIds={landFeilmeldingSpråkIdsSøker}
                fraDatoLabelSpråkIds={fraDatoLabelSpråkIdsSøker}
                fraDatoFeilmeldingSpråkIds={fraDatoFeilmeldingSpråkIdsSøker}
                tilDatoLabelSpråkIds={tilDatoLabelSpråkIdsSøker}
                tilDatoFeilmeldingSpråkIds={tilDatoFeilmeldingSpråkIdsSøker}
                tilDatoUkjentLabelSpråkId={tilDatoUkjentLabelSpråkIdSøker}
                onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
            />
        </Steg>
    );
};

export default OmDeg;
