import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Checkbox, ErrorMessage } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import useFørsteRender from '../../../hooks/useFørsteRender';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const CheckboxWrapper = styled.div`
    margin: 0 0 1rem 0;
`;

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
        <CheckboxWrapper>
            <Checkbox
                id={felt.id}
                checked={felt.verdi === ESvar.JA}
                onChange={event =>
                    felt.validerOgSettFelt(event.target.checked ? ESvar.JA : ESvar.NEI)
                }
            >
                <SpråkTekst id={labelSpråkTekstId} values={språkVerdier} />
            </Checkbox>
            {visFeilmeldinger && felt.feilmelding && (
                <ErrorMessage>{felt.feilmelding}</ErrorMessage>
            )}
        </CheckboxWrapper>
    ) : null;
};
