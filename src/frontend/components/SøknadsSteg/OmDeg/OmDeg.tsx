import React from 'react';

import { Input } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../Steg/Steg';
import { Personopplysninger } from './Personopplysninger';
import { omDegSpråkTekstId, OmDegSpørsmålId } from './spørsmål';
import { SøkerBorIkkePåAdresse } from './SøkerBorIkkePåAdresse';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } = useOmdeg();
    const { søknad } = useApp();
    const { søker } = søknad;
    return (
        <Steg
            tittel={<SpråkTekst id={'omdeg.tittel'} />}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            skjema={skjema}
            gåVidereOnClickCallback={oppdaterSøknad}
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
                        tilleggsinfoTekstId={'personopplysninger.lesmer-innhold.riktigAdresse'}
                    />
                )}

                {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                    <SøkerBorIkkePåAdresse
                        advarselTekstId={'personopplysninger.alert.riktigAdresse'}
                        utfyllendeAdvarselInfoId={'personopplysninger.info.endreAdresse'}
                    />
                )}
                {!søker.adresse && (
                    <SøkerBorIkkePåAdresse
                        advarselTekstId={'personopplysninger.info.ukjentadresse'}
                        utfyllendeAdvarselInfoId={'personopplysninger.info.vi-trenger-din-adresse'}
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
                    felt={skjema.felter.oppholdslandDato}
                    skjema={skjema}
                    labelTekstId={'omdeg.spm.landopphold.dato'}
                />
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.værtINorgeITolvMåneder}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.værtINorgeITolvMåneder]}
                />
                <Datovelger
                    felt={skjema.felter.komTilNorgeDato}
                    skjema={skjema}
                    labelTekstId={'omdeg.spm.komTilNorge.dato'}
                />
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]}
                />
                {skjema.felter.planleggerÅBoINorgeTolvMnd.verdi === ESvar.NEI && (
                    <p>Hei på deg jeg dukker opp</p>
                )}
            </KomponentGruppe>

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erAsylsøker}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.erAsylsøker]}
                />
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
