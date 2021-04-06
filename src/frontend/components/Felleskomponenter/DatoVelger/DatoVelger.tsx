import React from 'react';

import { FamilieDatovelger, ISODateString } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';

interface DatoVelgerProps {
    felt: Felt<ISODateString>;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    feilTekstId: string;
}

const DatoVelger: React.FC<DatoVelgerProps> = ({ felt, skjema, feilTekstId }) => {
    return felt.erSynlig ? (
        <FamilieDatovelger
            placeholder={'ddmmåå'}
            valgtDato={felt.verdi}
            label={feilTekstId} // Legg til ReactNode i felles
            {...felt.hentNavBaseSkjemaProps(skjema.visFeilmeldinger)}
            onChange={dato => {
                felt.hentNavInputProps(false).onChange(dato);
            }}
        />
    ) : null;
};

export default DatoVelger;
