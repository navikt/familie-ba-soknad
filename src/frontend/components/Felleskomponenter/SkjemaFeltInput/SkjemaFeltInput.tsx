import React, { ReactNode } from 'react';

import { Input, InputProps } from 'nav-frontend-skjema';

import { Felt } from '@navikt/familie-skjema';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface SkjemaFeltInputProps extends InputProps {
    // eslint-disable-next-line
    felt: Felt<any>;
    visFeilmeldinger: boolean;
    labelSpråkTekstId: string;
    språkValues?: Record<string, ReactNode>;
}

/**
 * Henter input props fra felt, og fra props. Props overstyrer felt.
 */
export const SkjemaFeltInput: React.FC<SkjemaFeltInputProps> = props => {
    const {
        felt,
        labelSpråkTekstId,
        visFeilmeldinger,
        språkValues,
        ...øvrigePropsStøttetAvNavInput
    } = props;
    const navInputPropsFraFeltHook = felt.hentNavInputProps(visFeilmeldinger);

    return felt.erSynlig ? (
        <div>
            <Input
                label={<SpråkTekst id={labelSpråkTekstId} values={språkValues} />}
                {...navInputPropsFraFeltHook}
                {...øvrigePropsStøttetAvNavInput}
                maxLength={500}
            />
        </div>
    ) : null;
};
