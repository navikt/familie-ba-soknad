import React from 'react';

import { Checkbox } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const VetIkkeCheckbox: React.FC<{
    labelSpråkId: string;
    checkboxUkjentFelt: Felt<ESvar>;
}> = ({ labelSpråkId, checkboxUkjentFelt }) => {
    return checkboxUkjentFelt.erSynlig ? (
        <Checkbox
            label={<SpråkTekst id={labelSpråkId} />}
            checked={checkboxUkjentFelt.verdi === ESvar.JA}
            onChange={event => {
                checkboxUkjentFelt
                    .hentNavInputProps(false)
                    .onChange(event.target.checked ? ESvar.JA : ESvar.NEI);
            }}
        />
    ) : null;
};

export default VetIkkeCheckbox;
