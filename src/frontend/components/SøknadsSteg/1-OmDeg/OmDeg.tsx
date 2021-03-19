import React from 'react';

import styled from 'styled-components/macro';

import { Input } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { device } from '../../../Theme';
import { hentFeltNavn } from '../../../utils/hjelpefunksjoner';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
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

const StyledSection = styled.section`
    margin-top: 4rem;

    p {
        font-size: 1.125rem;
    }
`;

const StyledInput = styled(Input)`
    label {
        font-size: 1.125rem;
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
            <StyledSection>
                <Personopplysninger />
            </StyledSection>

            <StyledSection>
                {søker.adresse && (
                    <>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.borPåRegistrertAdresse}
                            spørsmålTekstId={'personopplysninger.spm.riktigAdresse'}
                            tilleggsinfo={'personopplysninger.lesmer-innhold.riktigAdresse'}
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
            </StyledSection>

            <StyledSection>
                {skjema.felter.telefonnummer.erSynlig && (
                    <span id={hentFeltNavn(skjema, skjema.felter.telefonnummer)}>
                        <StyledInput
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
            </StyledSection>

            <StyledSection>
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
            </StyledSection>
            <StyledSection>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.værtINorgeITolvMåneder}
                    spørsmålTekstId={'omdeg.spm.vært-i-tolv-måneder'}
                />
            </StyledSection>
            <StyledSection>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erAsylsøker}
                    spørsmålTekstId={'omdeg.spm.erasylsøker'}
                />
            </StyledSection>
            <StyledSection>
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
            </StyledSection>
            <StyledSection>
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
            </StyledSection>
        </Steg>
    );
};

export default OmDeg;
