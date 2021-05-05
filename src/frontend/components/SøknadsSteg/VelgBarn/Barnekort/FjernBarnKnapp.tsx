import React from 'react';

import styled from 'styled-components/macro';

import { Knapp } from 'nav-frontend-knapper';

import { DeleteFilled } from '@navikt/ds-icons';

import { useApp } from '../../../../context/AppContext';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledKnapp = styled(Knapp)`
    margin: 1rem 0 -1rem -0.75rem; // -0.75 left kompanserer for padding-left fra .knapp--kompakt
`;

const StyledDeleteFilled = styled(DeleteFilled)`
    margin-right: 0.5rem;
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
        <StyledKnapp htmlType={'button'} type={'flat'} kompakt={true} onClick={fjern}>
            <StyledDeleteFilled />
            <SpråkTekst id={'hvilkebarn.fjern-barn.knapp'} />
        </StyledKnapp>
    );
};
