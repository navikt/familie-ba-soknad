import React from 'react';

import { Checkbox } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

export const SkjemaCheckbox: React.FC<{
    // eslint-disable-next-line
    felt: Felt<any>;
    visFeilmeldinger: boolean;
    labelSpråkTekstId: string;
}> = ({ felt, visFeilmeldinger, labelSpråkTekstId }) => {
    const onChange = event => {
        const { onChange: feltOnChange } = felt.hentNavInputProps(false);
        feltOnChange(event.target.checked ? ESvar.JA : ESvar.NEI);
    };

    return (
        <Checkbox
            {...felt.hentNavInputProps(visFeilmeldinger)}
            label={<SpråkTekst id={labelSpråkTekstId} />}
            onChange={onChange}
        />
    );
};
