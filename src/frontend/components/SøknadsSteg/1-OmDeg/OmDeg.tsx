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
import { omDegSpråkTekstId, OmDegSpørsmålId } from './typer';
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
            <StyledSection>
                <Personopplysninger />
            </StyledSection>

            <StyledSection>
                {søker.adresse && (
                    <>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.borPåRegistrertAdresse}
                            spørsmålTekstId={
                                omDegSpråkTekstId[OmDegSpørsmålId.borPåRegistrertAdresse]
                            }
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
            </StyledSection>

            <StyledSection>
                {skjema.felter.telefonnummer.erSynlig && (
                    <span id={hentFeltNavn(skjema, skjema.felter.telefonnummer)}>
                        <StyledInput
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
            </StyledSection>

            <StyledSection>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderSegINorge}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.oppholderSegINorge]}
                />
                {skjema.felter.oppholdsland.erSynlig && (
                    <span id={hentFeltNavn(skjema, skjema.felter.oppholdsland)}>
                        <StyledLandDropdown
                            label={
                                <SpråkTekst id={omDegSpråkTekstId[OmDegSpørsmålId.oppholdsland]} />
                            }
                            {...skjema.felter.oppholdsland.hentNavInputProps(
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
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.værtINorgeITolvMåneder]}
                />
            </StyledSection>
            <StyledSection>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erAsylsøker}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.erAsylsøker]}
                />
            </StyledSection>
            <StyledSection>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.jobberPåBåt}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.jobberPåBåt]}
                />
                {skjema.felter.jobberPåBåt.verdi === ESvar.JA && (
                    <span id={hentFeltNavn(skjema, skjema.felter.arbeidsland)}>
                        <StyledLandDropdown
                            {...skjema.felter.arbeidsland.hentNavInputProps(
                                skjema.visFeilmeldinger
                            )}
                            label={
                                <SpråkTekst id={omDegSpråkTekstId[OmDegSpørsmålId.arbeidsland]} />
                            }
                        />
                    </span>
                )}
            </StyledSection>
            <StyledSection>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarUtenlandspensjon}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.mottarUtenlandspensjon]}
                />
                {skjema.felter.mottarUtenlandspensjon.verdi === ESvar.JA && (
                    <span id={hentFeltNavn(skjema, skjema.felter.pensjonsland)}>
                        <StyledLandDropdown
                            {...skjema.felter.pensjonsland.hentNavInputProps(
                                skjema.visFeilmeldinger
                            )}
                            label={
                                <SpråkTekst id={omDegSpråkTekstId[OmDegSpørsmålId.pensjonsland]} />
                            }
                        />
                    </span>
                )}
            </StyledSection>
        </Steg>
    );
};

export default OmDeg;
