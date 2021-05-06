import React from 'react';

import { Checkbox } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import { AlternativtSvarForInput, IBarnMedISøknad } from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const VetIkkeCheckbox: React.FC<{
    barn: IBarnMedISøknad;
    labelSpråkId: string;
    checkboxUkjentFelt: Felt<ESvar>;
    søknadsdatafelt: string;
}> = ({ barn, labelSpråkId, checkboxUkjentFelt, søknadsdatafelt }) => {
    return checkboxUkjentFelt.erSynlig ? (
        <Checkbox
            label={<SpråkTekst id={labelSpråkId} />}
            defaultChecked={barn[søknadsdatafelt].svar === AlternativtSvarForInput.UKJENT}
            onChange={event => {
                checkboxUkjentFelt
                    .hentNavInputProps(false)
                    .onChange(event.target.checked ? ESvar.JA : ESvar.NEI);
            }}
        />
    ) : null;
};

export default VetIkkeCheckbox;
