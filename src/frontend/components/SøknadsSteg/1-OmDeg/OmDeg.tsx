import React from 'react';

import styled from 'styled-components/macro';

import { Input } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { device } from '../../../Theme';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../Steg/Steg';
import { Personopplysninger } from './Personopplysninger';
import { SøkerBorIkkePåAdresse } from './SøkerBorIkkePåAdresse';
import { omDegSpråkTekstId, OmDegSpørsmålId } from './typer';
import { useOmdeg } from './useOmdeg';

const StyledLandDropdown = styled(LandDropdown)`
    width: 50%;
    padding-right: 0.7rem;

    @media all and ${device.mobile} {
        width: 100%;
        padding: 0;
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
                {skjema.felter.oppholdsland.erSynlig && (
                    <StyledLandDropdown
                        label={<SpråkTekst id={omDegSpråkTekstId[OmDegSpørsmålId.oppholdsland]} />}
                        {...skjema.felter.oppholdsland.hentNavInputProps(skjema.visFeilmeldinger)}
                    />
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.værtINorgeITolvMåneder}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.værtINorgeITolvMåneder]}
                />
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
                {skjema.felter.jobberPåBåt.verdi === ESvar.JA && (
                    <StyledLandDropdown
                        {...skjema.felter.arbeidsland.hentNavInputProps(skjema.visFeilmeldinger)}
                        label={<SpråkTekst id={omDegSpråkTekstId[OmDegSpørsmålId.arbeidsland]} />}
                    />
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarUtenlandspensjon}
                    spørsmålTekstId={omDegSpråkTekstId[OmDegSpørsmålId.mottarUtenlandspensjon]}
                />
                {skjema.felter.mottarUtenlandspensjon.verdi === ESvar.JA && (
                    <StyledLandDropdown
                        {...skjema.felter.pensjonsland.hentNavInputProps(skjema.visFeilmeldinger)}
                        label={<SpråkTekst id={omDegSpråkTekstId[OmDegSpørsmålId.pensjonsland]} />}
                    />
                )}
            </KomponentGruppe>
        </Steg>
    );
};

export default OmDeg;
