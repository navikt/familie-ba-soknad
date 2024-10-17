import React from 'react';

import { BodyShort, Button } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { BarnekortContainer } from '../Barnekort/BarnekortContainer';

export const NyttBarnKort: React.FC<{ onLeggTilBarn: () => void }> = ({ onLeggTilBarn }) => {
    const { tekster, plainTekst } = useApp();

    const teksterForSteg = tekster().VELG_BARN;
    const { soekeForUregistrerteBarn } = teksterForSteg;

    const teksterForLeggTilBarnModal = tekster().FELLES.modaler.leggTilBarn;
    const { leggTilKnapp } = teksterForLeggTilBarnModal;

    return (
        <BarnekortContainer>
            <BodyShort spacing>{plainTekst(soekeForUregistrerteBarn)}</BodyShort>
            <Button
                type="button"
                variant="secondary"
                data-testid="leggTilBarnKnapp"
                onClick={() => onLeggTilBarn()}
            >
                {plainTekst(leggTilKnapp)}
            </Button>
        </BarnekortContainer>
    );
};
