import React from 'react';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';

import { guid } from 'nav-frontend-js-utils';
import { Element } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import Steg from '../Steg/Steg';
import { KomponentGruppe } from './layoutKomponenter';
import { Personopplysninger } from './Personopplysninger';
import { ESvarMedUbesvart, IStegEnFeltTyper, useOmdeg } from './useOmdeg';

// TODO: Bruk konstant for mobilbredde

interface IJaNeiBolkProps {
    skjema: ISkjema<IStegEnFeltTyper, string>;
    felt: Felt<ESvar | ESvarMedUbesvart>;
    spørsmålTekstId: string;
}

const JaNeiBolk: React.FC<IJaNeiBolkProps> = ({ skjema, felt, spørsmålTekstId }) => {
    if (felt.erSynlig) {
        return (
            <JaNeiSpørsmål
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                name={guid()}
                legend={
                    <>
                        <Element>
                            <FormattedMessage id={spørsmålTekstId} />
                        </Element>
                    </>
                }
                labelTekstForJaNei={{
                    ja: <FormattedMessage id={'ja'} />,
                    nei: <FormattedMessage id={'nei'} />,
                }}
            />
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

    p {
        font-size: 1.125rem;
    }
`;

const OmDeg: React.FC = () => {
    const { skjema, kanSendeSkjema } = useOmdeg();
    return (
        <Steg tittel={'Om deg'} kanGåTilNesteSteg={kanSendeSkjema}>
            <KomponentGruppe>
                <Personopplysninger skjema={skjema} />
            </KomponentGruppe>
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
