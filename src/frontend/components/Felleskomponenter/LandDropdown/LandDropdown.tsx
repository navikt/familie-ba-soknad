import React, { ReactNode } from 'react';

import { Alpha3Code, getAlpha3Codes, getName } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Select } from 'nav-frontend-skjema';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { device } from '../../../Theme';
import { SkjemaFeltTyper } from '../../../typer/skjema';

interface LandDropdownProps {
    felt: Felt<Alpha3Code | undefined>;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    label?: ReactNode;
}

const StyledSelect = styled(Select)`
    padding-top: 1rem;
    label {
        font-size: 1.125rem;
    }
`;

const Container = styled.div`
    width: 50%;
    padding-right: 0.7rem;

    @media all and ${device.mobile} {
        width: 100%;
        padding: 0;
    }
`;

export const LandDropdown: React.FC<LandDropdownProps> = ({ felt, skjema, label }) => {
    const intl = useIntl();

    const landkoderSortertPåNavn = Object.keys(getAlpha3Codes()).sort((a, b) => {
        return getName(a, intl.locale) >= getName(b, intl.locale) ? 1 : -1;
    });

    return felt.erSynlig ? (
        <Container id={felt.id}>
            <StyledSelect
                label={label}
                defaultValue={''}
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                id={undefined}
            >
                <option
                    disabled={true}
                    value={''}
                    label={intl.formatMessage({ id: 'landdropdown.velgland' })}
                />
                {landkoderSortertPåNavn.map(
                    (alphaCode): ReactNode => (
                        <option
                            value={alphaCode}
                            label={getName(alphaCode, intl.locale)}
                            key={alphaCode}
                        />
                    )
                )}
            </StyledSelect>
        </Container>
    ) : null;
};
