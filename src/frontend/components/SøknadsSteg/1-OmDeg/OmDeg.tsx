import React from 'react';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';

import { guid } from 'nav-frontend-js-utils';
import { Input } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import Steg from '../Steg/Steg';
import { KomponentGruppe } from './layoutKomponenter';
import { Personopplysninger } from './Personopplysninger';
import { SøkerBorIkkePåAdresse } from './SøkerBorIkkePåAdresse';
import { ESvarMedUbesvart, IStegEnFeltTyper, useOmdeg } from './useOmdeg';

// TODO: Bruk konstant for mobilbredde

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

// TODO: Bruk konstant for mobilbredde
const StyledLandDropdown = styled(LandDropdown)`
    @media all and (min-width: 420px) {
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
                <JaNeiBolk
                    skjema={skjema}
                    felt={skjema.felter.oppholderSegINorge}
                    spørsmålTekstId={'personopplysninger.spm.riktigAdresse'}
                    tilleggsinfo={'personopplysninger.lesmer-innhold.riktigAdresse'}
                />
                {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                    <SøkerBorIkkePåAdresse lenkePDFSøknad={'https://nav.no'} /> //TODO
                )}
            </StyledSection>
            <StyledSection>
                {skjema.felter.telefonnummer.erSynlig && (
                    <StyledInput
                        {...skjema.felter.telefonnummer.hentNavInputProps(skjema.visFeilmeldinger)}
                        name={'Telefonnummer'}
                        label={<FormattedMessage id={'person.telefonnr'} />}
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
