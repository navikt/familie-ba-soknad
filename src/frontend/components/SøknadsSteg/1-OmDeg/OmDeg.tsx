import React from 'react';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';

import { Element } from 'nav-frontend-typografi';

import { JaNeiSpørsmål } from '@navikt/familie-form-elements';

import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import Steg from '../Steg/Steg';
import { KomponentGruppe } from './layoutKomponenter';
import { Personopplysninger } from './Personopplysninger';
import { useOmdeg } from './useOmdeg';

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
                {skjema.felter.oppholderSegINorge.erSynlig && (
                    <JaNeiSpørsmål
                        {...skjema.felter.oppholderSegINorge.hentNavInputProps(
                            skjema.visFeilmeldinger
                        )}
                        name={'søker.oppholderseginorge'}
                        legend={
                            <>
                                <Element>
                                    <FormattedMessage id={'omdeg.spm.oppholderSegINorge'} />
                                </Element>
                            </>
                        }
                        labelTekstForJaNei={{
                            ja: <FormattedMessage id={'ja'} />,
                            nei: <FormattedMessage id={'nei'} />,
                        }}
                    />
                )}
                {skjema.felter.oppholdsLand.erSynlig && (
                    <StyledLandDropdown
                        label={<FormattedMessage id={'omdeg.spm.landopphold'} />}
                        {...skjema.felter.oppholdsLand.hentNavInputProps(skjema.visFeilmeldinger)}
                    />
                )}
            </StyledSection>
        </Steg>
    );
};

export default OmDeg;
