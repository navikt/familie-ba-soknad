import React, { ReactNode } from 'react';

import { Box, Label, BodyShort } from '@navikt/ds-react';

import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

export const BarnekortInfo: React.FC<{ labelId: string; verdi: ReactNode }> = ({
    labelId,
    verdi,
}) => {
    return (
        <Box>
            <Label as="p">
                <SpråkTekst id={labelId} />
            </Label>
            <BodyShort>{verdi}</BodyShort>
        </Box>
    );
};
