import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { TextField } from '@navikt/ds-react';
import { Felt } from '@navikt/familie-skjema';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface SkjemaFeltInputProps {
    // eslint-disable-next-line
    felt: Felt<any>;
    visFeilmeldinger: boolean;
    labelSpråkTekstId: string;
    språkValues?: Record<string, ReactNode>;
    description?: ReactNode;
    autoComplete?: 'on' | 'off';
    disabled?: boolean;
    fullbredde?: boolean;
}

const StyledTextField = styled(TextField)<{ fullbredde: boolean }>`
    width: ${props => (props.fullbredde ? '100%' : 'fit-content')};
`;

/**
 * Henter input props fra felt, og fra props. Props overstyrer felt.
 */
export const SkjemaFeltInput: React.FC<SkjemaFeltInputProps> = props => {
    const {
        felt,
        labelSpråkTekstId,
        visFeilmeldinger,
        språkValues,
        description,
        autoComplete = 'off',
        disabled,
        fullbredde = true,
    } = props;
    const navInputPropsFraFeltHook = felt.hentNavInputProps(visFeilmeldinger);

    return felt.erSynlig ? (
        <StyledTextField
            label={<SpråkTekst id={labelSpråkTekstId} values={språkValues} />}
            description={description}
            {...navInputPropsFraFeltHook}
            maxLength={500}
            autoComplete={autoComplete}
            disabled={disabled}
            fullbredde={fullbredde}
        />
    ) : null;
};
