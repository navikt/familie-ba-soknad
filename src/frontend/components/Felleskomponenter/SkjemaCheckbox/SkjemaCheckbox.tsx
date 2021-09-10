import React from 'react';

import { Checkbox } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import useFørsteRender from '../../../hooks/useFørsteRender';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

export const SkjemaCheckbox: React.FC<{
    felt: Felt<ESvar>;
    visFeilmeldinger?: boolean;
    labelSpråkTekstId: string;
}> = ({ felt, visFeilmeldinger = false, labelSpråkTekstId }) => {
    useFørsteRender(() => {
        felt.validerOgSettFelt(felt.verdi);
    });

    const onChange = event => {
        const { onChange: feltOnChange } = felt.hentNavInputProps(false);
        feltOnChange(event.target.checked ? ESvar.JA : ESvar.NEI);
    };

    return felt.erSynlig ? (
        <Checkbox
            checked={felt.verdi === ESvar.JA}
            {...felt.hentNavInputProps(visFeilmeldinger)}
            label={<SpråkTekst id={labelSpråkTekstId} />}
            onChange={onChange}
        />
    ) : null;
};
