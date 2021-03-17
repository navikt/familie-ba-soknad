import React from 'react';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';

import { guid } from 'nav-frontend-js-utils';
import { Input } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import Steg from '../Steg/Steg';
import { KomponentGruppe } from './layoutKomponenter';
import { Personopplysninger } from './Personopplysninger';
import { SøkerBorIkkePåAdresse } from './SøkerBorIkkePåAdresse';
import { ESvarMedUbesvart, IStegEnFeltTyper, useOmdeg } from './useOmdeg';

interface IJaNeiBolkProps {
    skjema: ISkjema<IStegEnFeltTyper, string>;
    felt: Felt<ESvar | ESvarMedUbesvart>;
    spørsmålTekstId: string;
    tilleggsinfo?: string;
}

const JaNeiBolk: React.FC<IJaNeiBolkProps> = ({ skjema, felt, spørsmålTekstId, tilleggsinfo }) => {
    if (felt.erSynlig) {
        const feltIndexISkjema = Object.entries(skjema.felter).findIndex(
            feltEntry => feltEntry[1] === felt
        );
        const feltNavn = Object.keys(skjema.felter)[feltIndexISkjema];

        return (
            <span id={feltNavn}>
                <JaNeiSpørsmål
                    {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                    name={guid()}
                    legend={
                        <>
                            <Element>
                                <FormattedMessage id={spørsmålTekstId} />
                            </Element>
                            {tilleggsinfo && (
                                <Normaltekst>
                                    <FormattedMessage id={tilleggsinfo} />
                                </Normaltekst>
                            )}
                        </>
                    }
                    labelTekstForJaNei={{
                        ja: <FormattedMessage id={'ja'} />,
                        nei: <FormattedMessage id={'nei'} />,
                    }}
                />
            </span>
        );
    } else {
        return <></>;
    }
};

const StyledSøkerBorIkkePåAdresse = styled(SøkerBorIkkePåAdresse)`
    margin-top: -3rem;
`;

const StyledLandDropdown = styled(LandDropdown)`
    @media all and (min-width: var(--mobile)) {
        width: 50%;
        padding-right: 0.7rem;
    }
    text-align: left;
`;

const StyledSection = styled.section`
    text-align: left;
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
            tittel={'Om deg'}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            skjema={skjema}
        >
            <KomponentGruppe>
                <Personopplysninger />
            </KomponentGruppe>

            <StyledSection>
                {søker.adresse && (
                    <>
                        <JaNeiBolk
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
                    <StyledInput
                        {...skjema.felter.telefonnummer.hentNavInputProps(skjema.visFeilmeldinger)}
                        name={'Telefonnummer'}
                        label={<FormattedMessage id={'personopplysninger.telefonnr'} />}
                        bredde={'M'}
                        type="tel"
                    />
                )}
            </StyledSection>

            <StyledSection>
                <JaNeiBolk
                    skjema={skjema}
                    felt={skjema.felter.oppholderSegINorge}
                    spørsmålTekstId={'omdeg.spm.oppholderSegINorge'}
                />
                {skjema.felter.oppholdsLand.erSynlig && (
                    <StyledLandDropdown
                        label={<FormattedMessage id={'omdeg.spm.landopphold'} />}
                        {...skjema.felter.oppholdsLand.hentNavInputProps(skjema.visFeilmeldinger)}
                    />
                )}
            </StyledSection>
            <StyledSection>
                <JaNeiBolk
                    skjema={skjema}
                    felt={skjema.felter.værtINorgeITolvMåneder}
                    spørsmålTekstId={'omdeg.spm.vært-i-tolv-måneder'}
                />
            </StyledSection>
            <StyledSection>
                <JaNeiBolk
                    skjema={skjema}
                    felt={skjema.felter.erAsylsøker}
                    spørsmålTekstId={'omdeg.spm.erasylsøker'}
                />
            </StyledSection>
            <StyledSection>
                <JaNeiBolk
                    skjema={skjema}
                    felt={skjema.felter.jobberPåBåt}
                    spørsmålTekstId={'omdeg.spm.jobberpåbåt'}
                />
                {skjema.felter.jobberPåBåt.verdi === ESvar.JA && (
                    <StyledLandDropdown
                        {...skjema.felter.arbeidsLand.hentNavInputProps(skjema.visFeilmeldinger)}
                        label={<FormattedMessage id={'omdeg.spm.hvilket-arbeidsland'} />}
                    />
                )}
            </StyledSection>
            <StyledSection>
                <JaNeiBolk
                    skjema={skjema}
                    felt={skjema.felter.mottarUtlandsPensjon}
                    spørsmålTekstId={'omdeg.spm.mottar-du-pensjon-fra-utland'}
                />
                {skjema.felter.mottarUtlandsPensjon.verdi === ESvar.JA && (
                    <StyledLandDropdown
                        {...skjema.felter.pensjonsLand.hentNavInputProps(skjema.visFeilmeldinger)}
                        label={<FormattedMessage id={'omdeg.spm.hvilket-pensjonsland'} />}
                    />
                )}
            </StyledSection>
        </Steg>
    );
};

export default OmDeg;
