import { TextField } from '@navikt/ds-react';
import type { Felt } from '@navikt/familie-skjema';

import classNames from 'classnames';

import type { FC, ReactNode } from 'react';

import styles from './SkjemaFeltInput.module.css';

interface SkjemaFeltInputProps {
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
export const SkjemaFeltInput: FC<SkjemaFeltInputProps> = props => {
    const { felt, label, visFeilmeldinger, description, autoComplete = 'off', disabled, fullbredde = true } = props;
    const navInputPropsFraFeltHook = felt.hentNavInputProps(visFeilmeldinger);

    return felt.erSynlig ? (
        <TextField
            className={classNames({ [styles.textField]: !fullbredde })}
            label={label}
            description={description}
            {...navInputPropsFraFeltHook}
            maxLength={500}
            autoComplete={autoComplete}
            disabled={disabled}
            data-testid={felt.id}
        />
    ) : null;
};
