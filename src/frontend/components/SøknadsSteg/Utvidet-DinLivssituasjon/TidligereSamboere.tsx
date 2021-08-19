import React from 'react';

import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';

import { AddCircle } from '@navikt/ds-icons';

import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';

const StyledFlatKnapp = styled(Flatknapp)`
    margin-top: 0.5rem;
`;

const TidligereSamboere: React.FC = () => {
    return (
        <>
            <Element>
                <SpråkTekst
                    id={
                        dinLivssituasjonSpørsmålSpråkId[
                            DinLivssituasjonSpørsmålId.hattFlereSamboereForSøktPeriode
                        ]
                    }
                />
            </Element>
            <StyledFlatKnapp kompakt>
                <AddCircle />
                <span>
                    <SpråkTekst id={'omdeg.leggtilfleresamboere.leggtil'} />
                </span>
            </StyledFlatKnapp>
        </>
    );
};
export default TidligereSamboere;
