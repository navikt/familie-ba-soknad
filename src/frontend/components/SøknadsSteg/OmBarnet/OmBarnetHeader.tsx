import React from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { TilfeldigBarnIkon } from '../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';

const HeaderWrapper = styled.div`
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BarnCounterWrapper = styled.div`
    padding: 1rem;
`;

const HorisontalLinje = styled.span`
    width: 100%;
    border-bottom: 1px solid black;
`;

export const OmBarnetHeader: React.FC<{ barn: IBarnMedISøknad }> = ({ barn }) => {
    const {
        søknad: { barnInkludertISøknaden },
    } = useAppContext();
    const barnIndex = barnInkludertISøknaden.findIndex(b => b.id === barn.id);

    return (
        <HeaderWrapper>
            <TilfeldigBarnIkon byttVedRerender={false} />
            <HorisontalLinje />
            <BarnCounterWrapper>
                <Heading size={'xsmall'} level={'3'}>
                    <SpråkTekst
                        id={'ombarnet.undertittel'}
                        values={{
                            x: barnIndex + 1,
                            antall: barnInkludertISøknaden.length,
                        }}
                    />
                </Heading>
            </BarnCounterWrapper>
        </HeaderWrapper>
    );
};
