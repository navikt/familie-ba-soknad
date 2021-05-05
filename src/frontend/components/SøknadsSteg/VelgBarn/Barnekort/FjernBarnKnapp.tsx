import React from 'react';

import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';

import { DeleteFilled } from '@navikt/ds-icons';

import { useApp } from '../../../../context/AppContext';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledFlatknapp = styled(Flatknapp)`
    margin: 1rem 0 -1rem -0.75rem; // -0.75 left kompanserer for padding-left fra .knapp--kompakt
`;

export const FjernBarnKnapp: React.FC<{ ident: string }> = ({ ident }) => {
    const { søknad, settSøknad } = useApp();
    const { barnRegistrertManuelt, barnInkludertISøknaden } = søknad;
    const fjern = () => {
        settSøknad({
            ...søknad,
            barnRegistrertManuelt: barnRegistrertManuelt.filter(barn => barn.ident !== ident),
            barnInkludertISøknaden: barnInkludertISøknaden.filter(barn => barn.ident !== ident),
        });
    };

    return (
        <StyledFlatknapp htmlType={'button'} mini={true} kompakt={true} onClick={fjern}>
            <span>
                <DeleteFilled /> <SpråkTekst id={'hvilkebarn.fjern-barn.knapp'} />
            </span>
        </StyledFlatknapp>
    );
};
