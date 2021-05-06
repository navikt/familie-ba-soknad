import React from 'react';

import { Checkbox } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import { AlternativtSvarForInput, IBarnMedISøknad } from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const VetIkkeCheckbox: React.FC<{
    barn: IBarnMedISøknad;
    labelSpråkId: string;
    ukjentDatoCheckboxFelt: Felt<ESvar>;
    søknadsdatafelt: string;
}> = ({ barn, labelSpråkId, ukjentDatoCheckboxFelt, søknadsdatafelt }) => {
    return (
        <Checkbox
            label={<SpråkTekst id={labelSpråkId} />}
            defaultChecked={barn[søknadsdatafelt].svar === AlternativtSvarForInput.UKJENT}
            onChange={event => {
                ukjentDatoCheckboxFelt
                    .hentNavInputProps(false)
                    .onChange(event.target.checked ? ESvar.JA : ESvar.NEI);
            }}
        />
    );
};

export default VetIkkeCheckbox;
