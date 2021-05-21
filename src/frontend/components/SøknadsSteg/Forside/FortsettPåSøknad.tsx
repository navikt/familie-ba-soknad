import React, { FC } from 'react';

import styled from 'styled-components/macro';

import KnappBase from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';

import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const StyledKnappBase = styled(KnappBase)`
    margin: 2.3rem auto 0 auto;
`;

const StyledFortsettPåSøknad = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const FortsettPåSøknad: FC = () => {
    const { fortsettPåSøknaden, startPåNytt } = useBekreftelseOgStartSoknad();
    return (
        <StyledFortsettPåSøknad>
            <Undertittel>
                <SpråkTekst id={'mellomlagring.info'} />
            </Undertittel>
            <StyledKnappBase type={'hoved'} onClick={fortsettPåSøknaden}>
                <SpråkTekst id={'mellomlagring.knapp.fortsett'} />
            </StyledKnappBase>
            <StyledKnappBase onClick={startPåNytt}>
                <SpråkTekst id={'mellomlagring.knapp.startpånytt'} />
            </StyledKnappBase>
        </StyledFortsettPåSøknad>
    );
};
export default FortsettPåSøknad;
