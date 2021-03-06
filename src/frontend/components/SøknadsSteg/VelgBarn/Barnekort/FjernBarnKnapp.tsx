import React from 'react';

import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';

import { DeleteFilled } from '@navikt/ds-icons';

import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { BarnetsId } from '../../OmBarnaDine/HvilkeBarnCheckboxGruppe';

const StyledFlatknapp = styled(Flatknapp)`
    margin: 1rem 0 -1rem -0.75rem; // -0.75 left kompanserer for padding-left fra .knapp--kompakt
    max-width: 100%;
    && {
        white-space: normal;
    }
`;

const StyledDeleteFilled = styled(DeleteFilled)`
    min-width: 1rem;
`;

const TekstContainer = styled.span`
    text-align: left;
`;

export const FjernBarnKnapp: React.FC<{
    barnId: BarnetsId;
    fjernBarnCallback: (ident: string) => void;
}> = ({ barnId, fjernBarnCallback }) => {
    return (
        <StyledFlatknapp
            htmlType={'button'}
            mini={true}
            kompakt={true}
            onClick={() => fjernBarnCallback(barnId)}
        >
            <StyledDeleteFilled />
            <TekstContainer>
                <SpråkTekst id={'hvilkebarn.fjern-barn.knapp'} />
            </TekstContainer>
        </StyledFlatknapp>
    );
};
