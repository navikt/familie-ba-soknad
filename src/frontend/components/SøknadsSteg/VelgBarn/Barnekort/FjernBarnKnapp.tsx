import React from 'react';

import styled from 'styled-components/macro';

import { Knapp } from 'nav-frontend-knapper';

import { DeleteFilled } from '@navikt/ds-icons';

import { useApp } from '../../../../context/AppContext';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledKnapp = styled(Knapp)`
    margin-top: 1rem;
    margin-bottom: -1rem;
    && {
        padding-left: 0;
    }
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
