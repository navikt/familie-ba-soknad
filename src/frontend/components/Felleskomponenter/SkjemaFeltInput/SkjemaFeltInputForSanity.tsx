import { ReactNode } from 'react';

import styled from 'styled-components';

import { TextField } from '@navikt/ds-react';
import type { Felt } from '@navikt/familie-skjema';

interface SkjemaFeltInputForSanityProps {
    // eslint-disable-next-line
    felt: Felt<any>;
    visFeilmeldinger: boolean;
    label: ReactNode;
    description?: ReactNode;
    autoComplete?: 'on' | 'off';
    disabled?: boolean;
    fullbredde?: boolean;
}

const StyledTextField = styled(TextField)<{ $fullbredde: boolean }>`
    width: ${props => (props.$fullbredde ? '100%' : 'fit-content')};
`;

/**
 * Henter input props fra felt, og fra props. Props overstyrer felt.
 */
export const SkjemaFeltInputForSanity: React.FC<SkjemaFeltInputForSanityProps> = props => {
    const { felt, label, visFeilmeldinger, description, autoComplete = 'off', disabled, fullbredde = true } = props;
    const navInputPropsFraFeltHook = felt.hentNavInputProps(visFeilmeldinger);

    return felt.erSynlig ? (
        <StyledTextField
            label={label}
            description={description}
            {...navInputPropsFraFeltHook}
            maxLength={500}
            autoComplete={autoComplete}
            disabled={disabled}
            $fullbredde={fullbredde}
            data-testid={felt.id}
        />
    ) : null;
};
