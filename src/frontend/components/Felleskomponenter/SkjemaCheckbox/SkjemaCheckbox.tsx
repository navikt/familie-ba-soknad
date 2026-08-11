import { Checkbox, ErrorMessage } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt } from '@navikt/familie-skjema';

import type { FC, ReactNode } from 'react';

import useFørsteRender from '../../../hooks/useFørsteRender';

interface SkjemaCheckboxProps {
    felt: Felt<ESvar>;
    visFeilmeldinger?: boolean;
    label: ReactNode;
}

export const SkjemaCheckbox: FC<SkjemaCheckboxProps> = ({ felt, visFeilmeldinger = false, label }) => {
    useFørsteRender(() => {
        felt.validerOgSettFelt(felt.verdi);
    });

    return felt.erSynlig ? (
        <div>
            <Checkbox
                id={felt.id}
                data-testid={felt.id}
                checked={felt.verdi === ESvar.JA}
                onChange={event => felt.validerOgSettFelt(event.target.checked ? ESvar.JA : ESvar.NEI)}
            >
                {label}
            </Checkbox>
            {visFeilmeldinger && felt.feilmelding && <ErrorMessage>{felt.feilmelding}</ErrorMessage>}
        </div>
    ) : null;
};
