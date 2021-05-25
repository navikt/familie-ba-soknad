import React, { FC } from 'react';

import styled from 'styled-components/macro';

import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import KnappBase from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const StyledKnappBase = styled(KnappBase)`
    margin: 0 auto 2rem auto;
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
            <KomponentGruppe>
                <AlertStripeInfo>
                    <Normaltekst>
                        <SpråkTekst id={'mellomlagring.info'} />
                    </Normaltekst>
                </AlertStripeInfo>
            </KomponentGruppe>
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
