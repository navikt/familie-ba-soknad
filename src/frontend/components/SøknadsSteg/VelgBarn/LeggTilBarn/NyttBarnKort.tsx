import React from 'react';

import { BodyShort, Button } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { ILeggTilBarnTekstinnhold } from '../../../../typer/sanity/modaler/leggTilBarn';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { BarnekortContainer } from '../Barnekort/BarnekortContainer';
import { IVelgBarnTekstinnhold } from '../innholdTyper';

export const NyttBarnKort: React.FC<{ onLeggTilBarn: () => void }> = ({ onLeggTilBarn }) => {
    const { tekster, plainTekst } = useApp();
    const teksterForSteg: IVelgBarnTekstinnhold = tekster()[ESanitySteg.VELG_BARN];
    const teksterForLeggTilBarnModal: ILeggTilBarnTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.leggTilBarn;
    const { soekeForUregistrerteBarn } = teksterForSteg;

    return (
        <BarnekortContainer>
            <BodyShort spacing>{plainTekst(soekeForUregistrerteBarn)}</BodyShort>
            <Button
                type="button"
                variant="secondary"
                data-testid="leggTilBarnKnapp"
                onClick={() => onLeggTilBarn()}
            >
                {plainTekst(teksterForLeggTilBarnModal.leggTilKnapp)}
            </Button>
        </BarnekortContainer>
    );
};
