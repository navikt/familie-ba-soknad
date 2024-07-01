import React from 'react';

import { BodyShort, Button } from '@navikt/ds-react';

import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { BarnekortContainer } from '../Barnekort/Barnekort';

export const NyttBarnKort: React.FC<{ onLeggTilBarn: () => void }> = ({ onLeggTilBarn }) => {
    return (
        <BarnekortContainer>
            <BodyShort spacing>
                <SpråkTekst id="hvilkebarn.leggtilbarn.kort" />
            </BodyShort>
            <Button type="button" variant="secondary" onClick={() => onLeggTilBarn()}>
                <SpråkTekst id="hvilkebarn.leggtilbarn.kort.knapp" />
            </Button>
        </BarnekortContainer>
    );
};
