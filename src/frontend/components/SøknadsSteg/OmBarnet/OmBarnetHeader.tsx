import React from 'react';

import styled from 'styled-components/macro';

import { Systemtittel } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { TilfeldigBarnIkon } from '../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';

const HeaderWrapper = styled.div`
    text-align: center;
    margin-bottom: 2rem;
    img {
        margin: auto;
        display: block;
    }
`;

const BarnCounterWrapper = styled.div`
    border-top: 1px solid black;
    padding: 1rem;
`;

export const OmBarnetHeader: React.FC<{ barn: IBarnMedISøknad }> = ({ barn }) => {
    const {
        søknad: { barnInkludertISøknaden },
    } = useApp();
    const barnIndex = barnInkludertISøknaden.findIndex(b => b.id === barn.id);

    return (
        <HeaderWrapper>
            <TilfeldigBarnIkon byttVedRerender={false} />
            <BarnCounterWrapper>
                <Systemtittel>
                    <SpråkTekst
                        id={'ombarnet.undertittel'}
                        values={{
                            x: barnIndex + 1,
                            antall: barnInkludertISøknaden.length,
                        }}
                    />
                </Systemtittel>
            </BarnCounterWrapper>
        </HeaderWrapper>
    );
};
