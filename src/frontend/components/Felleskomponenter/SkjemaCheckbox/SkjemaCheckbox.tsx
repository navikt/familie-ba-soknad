import { ReactNode } from 'react';

import { Checkbox, ErrorMessage } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt } from '@navikt/familie-skjema';

import useFørsteRender from '../../../hooks/useFørsteRender';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

export const SkjemaCheckbox: React.FC<{
    felt: Felt<ESvar>;
    visFeilmeldinger?: boolean;
    labelSpråkTekstId: string;
    språkVerdier?: { [key: string]: ReactNode };
}> = ({ felt, visFeilmeldinger = false, labelSpråkTekstId, språkVerdier }) => {
    useFørsteRender(() => {
        felt.validerOgSettFelt(felt.verdi);
    });

    return felt.erSynlig ? (
        <div>
            <Checkbox
                id={felt.id}
                checked={felt.verdi === ESvar.JA}
                onChange={event => felt.validerOgSettFelt(event.target.checked ? ESvar.JA : ESvar.NEI)}
            >
                <SpråkTekst id={labelSpråkTekstId} values={språkVerdier} />
            </Checkbox>
            {visFeilmeldinger && felt.feilmelding && <ErrorMessage>{felt.feilmelding}</ErrorMessage>}
        </div>
    ) : null;
};
