import React from 'react';

import { Input, InputProps } from 'nav-frontend-skjema';

import { Felt } from '@navikt/familie-skjema';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface SkjemaFeltInputProps extends InputProps {
    // eslint-disable-next-line
    felt: Felt<any>;
    visFeilmeldinger: boolean;
    labelSpråkTekstId: string;
}

export const SkjemaFeltInput: React.FC<SkjemaFeltInputProps> = props => {
    const { felt, labelSpråkTekstId, visFeilmeldinger, ...navInputProps } = props;
    return felt.erSynlig ? (
        <Input
            label={<SpråkTekst id={labelSpråkTekstId} />}
            {...felt.hentNavInputProps(visFeilmeldinger)}
            {...navInputProps}
        />
    ) : null;
};
