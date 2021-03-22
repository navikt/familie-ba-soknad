import React from 'react';

import styled from 'styled-components/macro';

import { Input } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { device } from '../../../Theme';
import { hentFeltNavn } from '../../../utils/hjelpefunksjoner';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import Seksjon from '../../Felleskomponenter/Seksjon/Seksjon';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../Steg/Steg';
import { Personopplysninger } from './Personopplysninger';
import { SøkerBorIkkePåAdresse } from './SøkerBorIkkePåAdresse';
import { useOmdeg } from './useOmdeg';

const StyledSøkerBorIkkePåAdresse = styled(SøkerBorIkkePåAdresse)`
    margin-top: -3rem;
`;

const StyledLandDropdown = styled(LandDropdown)`
    width: 50%;
    padding-right: 0.7rem;

    @media all and ${device.mobile} {
        width: 100%;
        padding: 0;
    }
`;

const OmDeg: React.FC = () => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk } = useOmdeg();
    const { søknad } = useApp();
    const { søker } = søknad;
    return (
        <Steg
            tittel={<SpråkTekst id={'omdeg.tittel'} />}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            skjema={skjema}
        >
            <Seksjon>
                <Personopplysninger />
            </Seksjon>

            <Seksjon>
                {søker.adresse && (
                    <>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.borPåRegistrertAdresse}
                            spørsmålTekstId={'personopplysninger.spm.riktigAdresse'}
                            tilleggsinfoTekstId={'personopplysninger.lesmer-innhold.riktigAdresse'}
                        />

                        {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                            <SøkerBorIkkePåAdresse
                                advarselTekstId={'personopplysninger.alert.riktigAdresse'}
                                utfyllendeAdvarselInfoId={'personopplysninger.info.endreAdresse'}
                            />
                        )}
                    </>
                )}

                {!søker.adresse && (
                    <StyledSøkerBorIkkePåAdresse
                        advarselTekstId={'personopplysninger.info.ukjentadresse'}
                        utfyllendeAdvarselInfoId={'personopplysninger.info.vi-trenger-din-adresse'}
                    />
                )}
                {skjema.felter.telefonnummer.erSynlig && (
                    <span id={hentFeltNavn(skjema, skjema.felter.telefonnummer)}>
                        <Input
                            {...skjema.felter.telefonnummer.hentNavInputProps(
                                skjema.visFeilmeldinger
                            )}
                            name={'Telefonnummer'}
                            label={<SpråkTekst id={'personopplysninger.telefonnr'} />}
                            bredde={'M'}
                            type="tel"
                        />
                    </span>
                )}
            </Seksjon>

            <Seksjon>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderSegINorge}
                    spørsmålTekstId={'omdeg.spm.oppholderSegINorge'}
                />
                {skjema.felter.oppholdsLand.erSynlig && (
                    <span id={hentFeltNavn(skjema, skjema.felter.oppholdsLand)}>
                        <StyledLandDropdown
                            label={<SpråkTekst id={'omdeg.spm.landopphold'} />}
                            {...skjema.felter.oppholdsLand.hentNavInputProps(
                                skjema.visFeilmeldinger
                            )}
                        />
                    </span>
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.værtINorgeITolvMåneder}
                    spørsmålTekstId={'omdeg.spm.vært-i-tolv-måneder'}
                />
            </Seksjon>

            <Seksjon>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erAsylsøker}
                    spørsmålTekstId={'omdeg.spm.erasylsøker'}
                />
            </Seksjon>

            <Seksjon>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.jobberPåBåt}
                    spørsmålTekstId={'omdeg.spm.jobberpåbåt'}
                />
                {skjema.felter.jobberPåBåt.verdi === ESvar.JA && (
                    <span id={hentFeltNavn(skjema, skjema.felter.arbeidsLand)}>
                        <StyledLandDropdown
                            {...skjema.felter.arbeidsLand.hentNavInputProps(
                                skjema.visFeilmeldinger
                            )}
                            label={<SpråkTekst id={'omdeg.spm.hvilket-arbeidsland'} />}
                        />
                    </span>
                )}
            </Seksjon>
            <Seksjon>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarUtlandsPensjon}
                    spørsmålTekstId={'omdeg.spm.mottar-du-pensjon-fra-utland'}
                />
                {skjema.felter.mottarUtlandsPensjon.verdi === ESvar.JA && (
                    <span id={hentFeltNavn(skjema, skjema.felter.pensjonsLand)}>
                        <StyledLandDropdown
                            {...skjema.felter.pensjonsLand.hentNavInputProps(
                                skjema.visFeilmeldinger
                            )}
                            label={<SpråkTekst id={'omdeg.spm.hvilket-pensjonsland'} />}
                        />
                    </span>
                )}
            </Seksjon>
        </Steg>
    );
};

export default OmDeg;
