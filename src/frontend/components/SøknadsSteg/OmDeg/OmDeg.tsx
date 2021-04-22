import React from 'react';

import { Input } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { SøkerMåBrukePDF } from '../../Felleskomponenter/SøkerMåBrukePDF';
import Steg from '../Steg/Steg';
import { Personopplysninger } from './Personopplysninger';
import { omDegSpråkTekstId, OmDegSpørsmålId } from './spørsmål';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } = useOmdeg();
    const { søknad } = useApp();
    const { søker } = søknad;
    return (
        <Steg
            tittel={<SpråkTekst id={'omdeg.sidetittel'} />}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            skjema={skjema}
            settSøknadsdataCallback={oppdaterSøknad}
        >
            <KomponentGruppe>
                <Personopplysninger />
            </KomponentGruppe>

            <KomponentGruppe>
                {søker.adresse && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.borPåRegistrertAdresse}
                        spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.borPåRegistrertAdresse]}
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
                        advarselTekstId={'omdeg.personopplysninger.ikke-registrert.alert'}
                    />
                )}
            </KomponentGruppe>

            <KomponentGruppe>
                {skjema.felter.telefonnummer.erSynlig && (
                    <span id={skjema.felter.telefonnummer.id}>
                        <Input
                            {...skjema.felter.telefonnummer.hentNavInputProps(
                                skjema.visFeilmeldinger
                            )}
                            name={'Telefonnummer'}
                            label={
                                <SpråkTekst id={omDegSpråkTekstId[OmDegSpørsmålId.telefonnummer]} />
                            }
                            bredde={'M'}
                            type="tel"
                        />
                    </span>
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderSegINorge}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.oppholderSegINorge]}
                />
                <LandDropdown
                    felt={skjema.felter.oppholdsland}
                    skjema={skjema}
                    label={<SpråkTekst id={omDegSpråkTekstId[OmDegSpørsmålId.oppholdsland]} />}
                />
                <Datovelger
                    avgrensDatoFremITid={true}
                    felt={skjema.felter.oppholdslandDato}
                    skjema={skjema}
                    labelTekstId={omDegSpråkTekstId[OmDegSpørsmålId.oppholdslandDato]}
                />
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.værtINorgeITolvMåneder}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.værtINorgeITolvMåneder]}
                />
                <Datovelger
                    avgrensDatoFremITid={true}
                    felt={skjema.felter.komTilNorgeDato}
                    skjema={skjema}
                    labelTekstId={omDegSpråkTekstId[OmDegSpørsmålId.komTilNorgeDato]}
                />
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]}
                />
                {skjema.felter.planleggerÅBoINorgeTolvMnd.verdi === ESvar.NEI && (
                    <AlertStripe type={'advarsel'}>
                        <SpråkTekst id={'omdeg.planlagt-opphold-sammenhengende.alert'} />
                    </AlertStripe>
                )}
            </KomponentGruppe>

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erAsylsøker}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.erAsylsøker]}
                />
                {skjema.felter.erAsylsøker.verdi === ESvar.JA && (
                    <AlertStripe type={'info'}>
                        <SpråkTekst id={'omdeg.asylsøker.alert'} />
                    </AlertStripe>
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.jobberPåBåt}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.jobberPåBåt]}
                />

                <LandDropdown
                    felt={skjema.felter.arbeidsland}
                    skjema={skjema}
                    label={<SpråkTekst id={omDegSpråkTekstId[OmDegSpørsmålId.arbeidsland]} />}
                />

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarUtenlandspensjon}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.mottarUtenlandspensjon]}
                />
                <LandDropdown
                    felt={skjema.felter.pensjonsland}
                    skjema={skjema}
                    label={<SpråkTekst id={omDegSpråkTekstId[OmDegSpørsmålId.pensjonsland]} />}
                />
            </KomponentGruppe>
        </Steg>
    );
};

export default OmDeg;
