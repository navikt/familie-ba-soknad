import React from 'react';

import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';

import { DeleteFilled } from '@navikt/ds-icons';

import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledFlatknapp = styled(Flatknapp)`
    margin: 1rem 0 -1rem -0.75rem; // -0.75 left kompanserer for padding-left fra .knapp--kompakt
`;

export const FjernBarnKnapp: React.FC<{
    ident: string;
    fjernBarnCallback: (ident: string) => void;
}> = ({ ident, fjernBarnCallback }) => {
    return (
        <StyledFlatknapp
            htmlType={'button'}
            mini={true}
            kompakt={true}
            onClick={() => fjernBarnCallback(ident)}
        >
            <DeleteFilled />
            <span>
                <SpråkTekst id={'hvilkebarn.fjern-barn.knapp'} />
            </span>
        </StyledFlatknapp>
    );
};
