import React from 'react';

import { BodyShort, Box, Button } from '@navikt/ds-react';

import { useAppContext } from '../../../../context/AppContext';

export const NyttBarnKort: React.FC<{ onLeggTilBarn: () => void }> = ({ onLeggTilBarn }) => {
    const { tekster, plainTekst } = useAppContext();

    const teksterForSteg = tekster().VELG_BARN;
    const { soekeForUregistrerteBarn } = teksterForSteg;

    const teksterForLeggTilBarnModal = tekster().FELLES.modaler.leggTilBarn;
    const { leggTilKnapp } = teksterForLeggTilBarnModal;

    return (
        <Box padding="6" background="surface-subtle" borderRadius="medium">
            <BodyShort spacing>{plainTekst(soekeForUregistrerteBarn)}</BodyShort>
            <Button type="button" variant="secondary" data-testid="legg-til-barn-knapp" onClick={() => onLeggTilBarn()}>
                {plainTekst(leggTilKnapp)}
            </Button>
        </Box>
    );
};
