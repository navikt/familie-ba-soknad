import React from 'react';

import styled from 'styled-components/macro';

import AlertStripe from 'nav-frontend-alertstriper';

import { useApp } from '../../../context/AppContext';
import { visLabelOgSvar } from '../../../utils/visning';
import Steg from '../Steg/Steg';
import { Personopplysninger } from './Personopplysninger';

const StyledOmDeg = styled.div`
    text-align: left;
`;

const OmDeg: React.FC = () => {
    const { søknad } = useApp();

    return (
        <Steg tittel={'Om deg'} erSpørsmålBesvart={true}>
            <Personopplysninger />
            <StyledOmDeg>
                <AlertStripe type="info" form="inline">
                    Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos
                    Folkeregisteret.
                </AlertStripe>
                {visLabelOgSvar(søknad.søker.verdi.navn, '2rem')}
            </StyledOmDeg>
        </Steg>
    );
};

export default OmDeg;
