import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { TextField } from '@navikt/ds-react';
import type { Felt } from '@navikt/familie-skjema';

import styles from './SkjemaFeltInput.module.css';

interface SkjemaFeltInputProps {
    // eslint-disable-next-line
    felt: Felt<any>;
    visFeilmeldinger: boolean;
    label: ReactNode;
    description?: ReactNode;
    autoComplete?: 'on' | 'off';
    disabled?: boolean;
    fullbredde?: boolean;
}

/**
 * Henter input props fra felt, og fra props. Props overstyrer felt.
 */
export const SkjemaFeltInput: React.FC<SkjemaFeltInputProps> = props => {
    const { felt, label, visFeilmeldinger, description, autoComplete = 'off', disabled, fullbredde = true } = props;
    const navInputPropsFraFeltHook = felt.hentNavInputProps(visFeilmeldinger);

    return felt.erSynlig ? (
        <TextField
            className={classNames({ [styles.textField]: !fullbredde })}
            label={label}
            description={description}
            {...navInputPropsFraFeltHook}
            maxLength={200}
            autoComplete={autoComplete}
            disabled={disabled}
            data-testid={felt.id}
        />
    ) : null;
};
